import { createSlice,} from '@reduxjs/toolkit';

export interface UserOAuthCheck {
    isVerified : boolean;
}

const initialState : UserOAuthCheck = {
    isVerified : false
}

export const oAuthCheckSlice = createSlice({
    name : 'oAuthCheck',
    initialState,
    reducers : {
        setOAuthVerified: (state) => {
            state.isVerified = true
        },
        resetOAuthVerified: (state) => {
            state.isVerified = false
        }
    }
})

export const { 
    
   setOAuthVerified,
   resetOAuthVerified

} = oAuthCheckSlice.actions;

export default oAuthCheckSlice.reducer;