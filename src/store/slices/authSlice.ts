import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export interface User {
    userId : string;
    email : string;
    role : 'ADMIN' | 'USER';
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
        },
    }
})

export const { 
    
    setUser, 
    clearUser,

} = authSlice.actions;

export default authSlice.reducer;