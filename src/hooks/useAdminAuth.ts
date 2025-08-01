import { useEffect } from "react";
import { useDispatch } from "react-redux"
import { useAdminCheckAuthQuery } from '@/services/auth-user-service/auth/admin'
import { useSelect } from "./useSelect";
import { useAuthActions } from '@/hooks/useDispatch'
export const useAdminAuth = () => {
    const { user } = useSelect()
    const { login } = useAuthActions()
    const dispatch = useDispatch();    

    const {
        data,
        error,
        isLoading
    } = useAdminCheckAuthQuery()

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