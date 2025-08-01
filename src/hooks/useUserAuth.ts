import { useEffect } from "react";
import { useDispatch } from "react-redux"
import { useUserCheckAuthQuery } from '@/services/auth-user-service/auth/user'
import { useSelect } from "./useSelect";
import { useAuthActions } from '@/hooks/useDispatch'
export const useUserAuth = () => {
    const { user } = useSelect()
    const { login } = useAuthActions()
    const dispatch = useDispatch();    

    const {
        data,
        error,
        isLoading
    } = useUserCheckAuthQuery()

    useEffect(() => {
        console.log(data)
        if(data){
            login({...data.data})
        }

    }, [data, error, dispatch, login]);

    return {
        userDetails : user.details,
        isAuthenticated : user.isAuthenticated,
        isLoading
    }
}