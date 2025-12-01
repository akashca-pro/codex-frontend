import { useEffect } from "react";
import { useDispatch } from "react-redux"
import { useProfileQuery } from '@/apis/auth-user/profile/user'
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
    } = useProfileQuery()

    useEffect(() => {
        console.log(data)
        if (data) {
            login({ ...data.data, role: 'USER' })
        }

    }, [data, error, dispatch, login]);

    return {
        userDetails: user.details,
        isAuthenticated: user.isAuthenticated,
        isLoading
    }
}