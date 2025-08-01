import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice,} from '@reduxjs/toolkit';

export interface UserEmail {
    email : string;
}

const initialState : UserEmail = {
    email : ''
}

export const emailSlice = createSlice({
    name : 'userEmail',
    initialState,
    reducers : {
        setEmail : (state,action : PayloadAction<UserEmail>) => {
            state.email = action.payload.email;
        },
        clearEmail : (state) => {
            state.email = '';                                                                                                                                                                                                                             
        },
    }
})

export const { 
    
    setEmail,
    clearEmail

} = emailSlice.actions;

export default emailSlice.reducer;