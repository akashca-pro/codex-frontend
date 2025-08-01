import AdminLoginForm from "@/features/auth/form-components/AdminLoginForm"
import { RedirectAuthUser } from "@/components/protectors/RedirectAuthUser"

export default function AdminLoginPage() {
  return (
    <RedirectAuthUser>
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">Admin Portal</h1>
          <p className="text-gray-400">Administrative access only</p>
        </div>

        <AdminLoginForm />
      </div>
    </div>
    </RedirectAuthUser>
  )
}
