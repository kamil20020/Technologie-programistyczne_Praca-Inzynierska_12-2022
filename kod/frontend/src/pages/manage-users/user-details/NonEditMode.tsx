﻿import { Grid, Button } from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import KeycloakService from "../../../keycloak/KeycloakService";
import User from "../../../models/dto/User";
import { setNotificationMessage, setNotificationType, setNotificationStatus } from "../../../redux/slices/notificationSlice";
import { RootState } from "../../../redux/store";
import { FormLabel } from "./UserDetails";

export interface NonEditModeProps {
    user: User,
    username: string,
    setEditMode: (value: boolean) => void
}

const NonEditMode = (props: NonEditModeProps) => {

    const user = props.user
    const username = props.username

    const dispatch = useDispatch()

    const resetUserPassword = () => {
        
        KeycloakService.resetUserPassword(user.userAccountId as string)
        .then((response) => {
            dispatch(setNotificationMessage("Pomyślnie zresetowano hasło"))
            dispatch(setNotificationType('success'))
            dispatch(setNotificationStatus(true))
        })
        .catch((error) => {
            console.log(error)
            dispatch(setNotificationMessage("Nie udało się zresetować hasła"))
            dispatch(setNotificationType('error'))
            dispatch(setNotificationStatus(true))
        })
    }

    if(!user || !username)
        return <div></div>

    return (
        <Grid item xs={12} container justifyContent="center">
            <Grid item container>
                <Grid item xs={6} container spacing={3}>
                    <Grid item xs={12} container>
                        <Grid item xs={6}>
                            <FormLabel value="Imię"/>
                        </Grid>
                        <Grid item xs={6}>
                            <FormLabel value={user.firstname}/>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} container>
                        <Grid item xs={6}>
                            <FormLabel value="Nazwisko"/>
                        </Grid>
                        <Grid item xs={6}>
                            <FormLabel value={user.surname}/>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} container>
                        <Grid item xs={6}>
                            <FormLabel value="Nazwa użytkownika"/>
                        </Grid>
                        <Grid item xs={6}>
                            <FormLabel value={username}/>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} container>
                        <Grid item xs={6}>
                            <FormLabel value="Pseudonim"/>
                        </Grid>
                        <Grid item xs={6}>
                            <FormLabel value={user.nickname}/>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} container>
                        <Grid item xs={6}>
                            <FormLabel value="E-mail"/>
                        </Grid>
                        <Grid item xs={6}>
                            <FormLabel value={user.email}/>
                        </Grid>
                    </Grid>
                    <Grid item xs={9} container alignItems="center" justifyContent="center">
                        <Button
                            variant="contained"
                            color="info"
                            onClick={resetUserPassword}
                        >
                            Reset hasła
                        </Button>
                    </Grid>
                </Grid>
                <Grid item xs={6} container alignItems="center">
                    <Grid item xs={6} container justifyContent="center">
                        <FormLabel value="Avatar"/>
                    </Grid>
                    <Grid item xs={6} container justifyContent="center">
                        <img alt="avatar" src={`data:image/jpeg;base64,${user.avatar}`}/>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} container justifyContent="center" alignItems="center">
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => props.setEditMode(true)}
                >
                    Edytuj dane
                </Button>
            </Grid>
        </Grid>
    );
}

export default NonEditMode;