import { RedirectAuthUser } from "@/components/protectors/RedirectAuthUser"
import LoginForm from "@/features/auth/components/form-components/LoginForm"
import { Link } from "react-router-dom"
import GoogleLoginButton from "../../components/GoogleLoginButton"

export default function UserLoginPage() {

  return (
    <RedirectAuthUser>
    <div className="animate-slide-up">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-2">Welcome Back</h1>
        <p className="text-gray-400">Sign in to your account</p>
      </div>

      <LoginForm />

        {/* Forgot Password Link */}
        <div className="mt-4 text-center">
          <Link
            to="/login/forgot-password"
            className="text-sm font-medium text-orange-500 hover:text-orange-700 transition-colors"
          >
            Forgot your password? Click here to reset!
          </Link>
        </div>

      <div className="mt-6 text-center">
        {/* Google login */}
        <div className="flex justify-center">
          <GoogleLoginButton />
        </div>
        <p className="text-gray-400 mt-6">
          Don't have an account?{" "}
          <Link to="/signup" className="text-orange-500 hover:text-orange-700 transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </div>
    </RedirectAuthUser>
  )
}
