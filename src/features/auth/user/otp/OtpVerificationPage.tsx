import { RedirectAuthUser } from '@/components/protectors/RedirectAuthUser';
import OtpVerificationForm from '@/features/auth/components/form-components/OtpVerificationForm';

export default function OtpVerificationPage() {

  return (
    <RedirectAuthUser>
    <div className="animate-slide-up">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-2">OTP Verification</h1>
        <p className="text-gray-400">OTP sent to your registered mail </p>
      </div>

      <OtpVerificationForm />

    </div>
    </RedirectAuthUser>
  )

}