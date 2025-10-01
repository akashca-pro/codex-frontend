import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { destroyCookie } from "nookies";

export interface User {
    userId : string;
    username : string;
    email : string;
    role : 'ADMIN' | 'USER';
    avatar : string | null;
    country : string | null;
}

export interface AuthState {
    details : User | null ;
    isAuthenticated : boolean;
}

const initialState : AuthState = {
    details : null ,
    isAuthenticated : false,
}

export const authSlice = createSlice({
    name : 'auth',
    initialState,
    reducers : {
        setUser : (state,action : PayloadAction<User>) => {
            state.details = action.payload;
            state.isAuthenticated = true;
        },
        clearUser : (state) => {
            state.details = null;
            state.isAuthenticated = false;
            destroyCookie(null,'accessToken');                                                                                                                                                                                                                         
            destroyCookie(null,'refreshToken');                                                                                                                                                                                                                         
            destroyCookie(null,'role');                                                                                                                                                                                                                         
        },
    }
})

export const { 
    
    setUser, 
    clearUser,

} = authSlice.actions;

export default authSlice.reducer;