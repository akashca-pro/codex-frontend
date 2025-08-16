import { GoogleLogin, type CredentialResponse } from "@react-oauth/google"
import { toast } from "sonner"
import { useUserGoogleLoginMutation, } from '@/apis/auth-user/auth/user'
import { useAuthActions } from '@/hooks/useDispatch'

const GoogleLoginButton = () => {
  const [googleLogin] = useUserGoogleLoginMutation();
  const { login } = useAuthActions()
  const handleGoogleLogin = async(credentialResponse : CredentialResponse) => {
    
    const toastId = toast.loading('Please wait. . .');
    const { credential } = credentialResponse

    if(!credential){
      toast.error('Google auth failed',{
        className : 'error-toast', id : toastId
      })
      return
    }

    try {

        const res = await googleLogin({ oAuthId : credential }).unwrap();

        login({
            userId : res.data.userId,
            username : res.data.username,
            email : res.data.email,
            role : res.data.role,
            avatar : res.data.avatar
        })
        
        toast.success('Access Granted',{
          className : 'success-toast',
          id : toastId
        })
      
    } catch (error : any) {
      toast.error('Access Denied',{
        className : 'error-toast',
        id : toastId,
        description : error?.data?.message
      });
    }
  }

  return (
    <GoogleLogin
      onSuccess={handleGoogleLogin}      
      onError={() => toast.error("Google login failed",{
        className : 'error-toast'
      })}
      theme="filled_black" 
      size="large"
      width="100%"  
    />
  )
}

export default GoogleLoginButton
