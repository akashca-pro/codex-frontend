import { RedirectAuthUser } from "@/components/protectors/RedirectAuthUser"
import SignupForm from "@/features/auth/components/form-components/SignupForm"
import { Link } from "react-router-dom"
import GoogleLoginButton from "../../components/GoogleLoginButton"

export default function UserSignupPage() {
  return (
    <RedirectAuthUser>
    <div className="animate-slide-up">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-2">Create Account</h1>
        <p className="text-gray-400">Join us today</p>
      </div>

      <SignupForm />

      <div className="text-center">
        <div className="flex justify-center mt-3">
          <GoogleLoginButton />
        </div>
        <p className="text-gray-400 mt-3">
          Already have an account?{" "}
          <Link to="/login" className="text-orange-500 hover:text-orange-700 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
   </RedirectAuthUser>
  )
}
