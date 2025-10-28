import { RedirectAuthUser } from "@/components/protectors/RedirectAuthUser"
import ForgotPasswordForm from "../../components/form-components/ForgotPasswordForm"

export default function ForgotPasswordPage() {
  return (
    <RedirectAuthUser>
      <div className="animate-slide-up">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">
            Reset Your Password 
          </h1>
          <p className="text-gray-400">

            Enter your email and we’ll send you an OTP to reset your password.
          </p>
        </div>

        <ForgotPasswordForm />
      </div>
    </RedirectAuthUser>
  )
}
