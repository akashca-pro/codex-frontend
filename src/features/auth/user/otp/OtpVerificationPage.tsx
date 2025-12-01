import { RedirectAuthUser } from '@/components/protectors/RedirectAuthUser';
import OtpVerificationForm from '@/features/auth/components/form-components/OtpVerificationForm';
import { useUserResendOtpMutation, useUserVerifyOtpMutation} from '@/apis/auth-user/auth/user'
import { useNavigate } from "react-router-dom"
import { useAuthActions } from '@/hooks/useDispatch'
import { useSelect } from '@/hooks/useSelect'
import { toast } from 'sonner';
import type { OtpVerificationSchemaType } from '../../validations/schemas';

export default function OtpVerificationPage() {
  const [resendOtp] = useUserResendOtpMutation()
  const [verifyOtp] = useUserVerifyOtpMutation()
  const { login } = useAuthActions()
  const { email: globalEmail } = useSelect()
  const navigate = useNavigate()

  const handleResendOtp = async() => {
    const credentials = {
        email : globalEmail.email,
    }
    const toastId = toast.loading('New OTP generating',{
        className : 'info-toast'
    })
    try {
        await resendOtp(credentials).unwrap()
        toast.success(`New OTP sent to ${globalEmail.email}`,{
            id : toastId,
            className : 'success-toast'
        });
    } catch (error : any) {
      const apiErrors = error?.data?.error
      
      if (Array.isArray(apiErrors) && apiErrors.length > 0) {
        toast.dismiss(toastId);
        apiErrors.forEach((e: any) => {
          toast.error(`field : ${e.field}`, {
            description: `Error : ${e.message}`,
          })
        })
      }
        toast.error('Error',{
            className : 'error-toast',
            id : toastId,
            description : error?.data?.message
        })
    }
  }

  const handleVerifyOtp = async (values: OtpVerificationSchemaType) => {
    const credentials = {
        email : globalEmail.email,
        otp : values.otp
    }
    const toastId = toast.loading('Verifying OTP...',{
    })
    try {
        const res = await verifyOtp(credentials).unwrap();
        toast.success('OTP Verified',{
            id : toastId,
            className : 'success-toast',
            description : `Welcome , ${res.data.username} You're now part of the CodeX swarm.`
        })
        console.log(res);
        login({
            userId : res.data.userId,
            firstName : res.data.firstName,
            username : res.data.username,
            email : res.data.email,
            role : res.data.role,
            avatar : res.data.avatar,
            country : res.data.country ?? null
        })
        navigate('/dashboard');
    } catch (error : any) {
      const apiErrors = error?.data?.error
      
      if (Array.isArray(apiErrors) && apiErrors.length > 0) {
        toast.dismiss(toastId);
        apiErrors.forEach((e: any) => {
          toast.error(`field : ${e.field}`, {
            description: `Error : ${e.message}`,
          })
        })
      }
        toast.error('Error',{
            className : 'error-toast',
            id : toastId,
            description : error?.data?.message
        })
    }
  }

  return (
    <RedirectAuthUser>
    <div className="animate-slide-up">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-2">OTP Verification</h1>
        <p className="text-gray-400">OTP sent to your registered mail </p>
      </div>

      <OtpVerificationForm
        email={globalEmail.email}
        onResendOtp={handleResendOtp}
        onVerifyOtp={handleVerifyOtp}
      />

    </div>
    </RedirectAuthUser>
  )

}