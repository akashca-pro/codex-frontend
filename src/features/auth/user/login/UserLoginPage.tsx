import { RedirectAuthUser } from "@/components/protectors/RedirectAuthUser"
import LoginForm from "@/features/auth/form-components/LoginForm"
import { Link } from "react-router-dom"

export default function UserLoginPage() {

  return (
    <RedirectAuthUser>
    <div className="animate-slide-up">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-2">Welcome Back</h1>
        <p className="text-gray-400">Sign in to your account</p>
      </div>

      <LoginForm />

      <div className="mt-6 text-center">
        <p className="text-gray-400">
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
