﻿import { AnyAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Dispatch } from "react";
import { useDispatch, useSelector } from "react-redux";
import KeycloakService from "../../keycloak/KeycloakService";
import User from "../../models/dto/User";
import { RootState, store } from "../store";

export interface KeycloakState {
    access_token?: string,
    access_token_expires_in: number,
    refresh_token?: string,
    refresh_token_expires_in: number,
    authenticated: boolean,
    username: string,
    roles: string[]
}

const initialState: KeycloakState = {
    access_token: '',
    access_token_expires_in: 0,
    refresh_token: '',
    refresh_token_expires_in: 0,
    authenticated: false,
    username: '',
    roles: []
}

export interface Token{
    token: string,
    expires_in: number
}

export const keycloakSlice = createSlice({
    name: 'keycloak',
    initialState,
    reducers: {
        setAccessToken(state, action: PayloadAction<Token>){
            const data = action.payload
            state.access_token = data.token
            state.access_token_expires_in = data.expires_in
            state.authenticated = true
            KeycloakService.setAxiosHeader(state.access_token)
        },
        setRefreshToken(state, action: PayloadAction<Token>){
            const data = action.payload
            state.refresh_token = data.token
            state.refresh_token_expires_in = data.expires_in
        },
        logout(state){
            KeycloakService.logout(state.refresh_token as string)
            state.access_token = ''
            state.access_token_expires_in = 0
            state.refresh_token = ''
            state.refresh_token_expires_in = 0
            state.authenticated = false
            state.username = ''
            state.roles = []
        },
        setRoles(state, action: PayloadAction<string[]>){
            state.roles = action.payload
        },
        setUsername(state, action: PayloadAction<string>){
            state.username = action.payload
        }
    }
})

export const { setAccessToken, setRefreshToken, logout, setRoles, setUsername } = keycloakSlice.actions

export default keycloakSlice.reducer