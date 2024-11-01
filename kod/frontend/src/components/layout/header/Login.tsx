﻿import { Label } from "@mui/icons-material";
import { Button, FormControl, FormControlLabel, FormHelperText, Grid, Hidden, Input, InputLabel, OutlinedInput, TextField } from "@mui/material";
import { Stack } from "@mui/system";
import axios from "axios";
import { userInfo } from "os";
import React, { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import KeycloakService from "../../../keycloak/KeycloakService";
import { keycloakSlice, logout, setAccessToken, setRefreshToken, setRoles, setUsername } from "../../../redux/slices/keycloakSlice";
import { setNotificationMessage, setNotificationStatus, setNotificationType } from "../../../redux/slices/notificationSlice";
import { setUser } from "../../../redux/slices/userSlice";
import { RootState, store } from "../../../redux/store";
import FormValidator from "../../../services/FormValidator";
import UserAPIService from "../../../services/UserAPIService";
import XCloeasableDialog from "../../common/XCloeasableDialog";
import SetPassword from "./SetPassword";

interface FormFields {
    username: string,
    password: string
}

const Login = () => {

    const keycloak = useSelector((state: RootState) => state.keycloak)
    const dispatch = useDispatch()

    const [form, setForm] = React.useState<FormFields>({
        username: '',
        password: ''
    })

    const [errors, setErrors] = React.useState<FormFields>({
        username: '',
        password: ''
    })

    const navigate = useNavigate()

    const validateForm = () => {

        let success = true

        let newErrorsState = {...errors}

        if(!FormValidator.checkIfIsRequired(form.username)){
            newErrorsState.username = FormValidator.requiredMessage
            success = false
        }

        if(FormValidator.checkIfIsRequired(form.password)){

            if(!FormValidator.checkMinLength(form.password, 8)){
                newErrorsState.password = FormValidator.minLengthMessage
                success = false
            }
            else if(!FormValidator.checkContainsSmallLetter(form.password)){
                newErrorsState.password = FormValidator.smallLetterMessage
                success = false
            }
            else if(!FormValidator.checkContainsUpperLetter(form.password)){
                newErrorsState.password = FormValidator.upperLetterMessage
                success = false
            }
            else if(!FormValidator.checkContainsDigit(form.password)){
                newErrorsState.password = FormValidator.digitMessage
                success = false
            }
        }

        setErrors(newErrorsState)

        return success
    }

    const onFieldChange = (field: string, event: any) => {
        setForm({...form, [field]: event.target.value})
        setErrors({...errors, [field]: ''})
    }

    const handleSubmit = () => {

        if(!validateForm())
            return

        KeycloakService.login({username: form.username, password: form.password !== '' ? form.password : '1'})
        .then((response: any) => {
            const data = response.data
            const accessToken =  data.access_token
            const accessTokenExpiresIn = data.expires_in
            const refreshToken = data.refresh_token
            const refreshTokenExpiresIn = data.refresh_expires_in
            dispatch(setRefreshToken({token: refreshToken, expires_in: refreshTokenExpiresIn}))
            dispatch(setAccessToken({token: accessToken, expires_in: accessTokenExpiresIn}))

            dispatch(setNotificationMessage('Zalogowano pomyślnie'))
            dispatch(setNotificationType('success'))
            dispatch(setNotificationStatus(true))

            const decodedAccessToken = KeycloakService.decodeAccessToken(accessToken)

            dispatch(setRoles(decodedAccessToken.realm_access.roles))
            
            UserAPIService.getUserByUserAccountId(decodedAccessToken.sub)
            .then((response) => {
                dispatch(setUser(response.data))
                dispatch(setUsername(form.username))

                if(form.password == ''){
                    navigate('/set-password')
                }
            })
        })
        .catch((error) => {
            if(error.response.status == 401){
                dispatch(setNotificationMessage('Login/e-mail lub hasło są niepoprawne'))
                dispatch(setNotificationType('error'))
                dispatch(setNotificationStatus(true))
            }
        })
    }

    return (
        <XCloeasableDialog 
            title="Logowanie"
            showButton={true}
            form = {
                <Grid 
                    container 
                    spacing={2}
                    direction="column"
                    alignItems="center"
                >
                    <Grid item xs={6}>
                        <FormControl>
                            <TextField
                                id="username" 
                                label={form.username !== '' ? 'Nazwa użytkownika' : ''}
                                placeholder="Login lub E-mail"
                                color="secondary"
                                value={form.username}
                                error={errors.username != ''}
                                onChange={(event: any) => onFieldChange('username', event)} 
                                InputLabelProps={{
                                    style: { color: errors.username !== '' ? 'red' : '#5CA8EE' },
                                }}
                                sx={{marginTop: 2}}
                            />
                            <FormHelperText error>{errors.username + ' '}</FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl>
                            <TextField
                                id="password"
                                type="password"
                                label={form.password !== '' ? 'Hasło' : ''}
                                placeholder="Hasło"
                                color="secondary"
                                value={form.password}
                                error={errors.password != ''}
                                onChange={(event: any) => onFieldChange('password', event)} 
                                InputLabelProps={{
                                    style: { color: errors.password !== '' ? 'red' : '#5CA8EE' },
                                }}
                            />
                            <FormHelperText error>{errors.password + ' '}</FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleSubmit}
                        >
                            Zaloguj
                        </Button>
                    </Grid>
                </Grid>
            }
        />
    );
}

export default Login;

/*
axios.interceptors.response.use((response) => {
    if(response.status === 401) {
        console.log('A')
        alert("You are not authorized");
    }
    return response;
}, (error) => {
    console.log('A')
    if (error.response && error.response.data) {
        return Promise.reject(error.response.data);
    }
    return Promise.reject(error.message);
});*/