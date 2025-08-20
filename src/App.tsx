import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthLayout from "./features/auth/AuthLayout";
import LandingLayout from "./features/landing/LandingLayout";
import LandingPage from "./features/landing/landing/LandingPage";
import UserLoginPage from "./features/auth/user/login/UserLoginPage";
import UserSignupPage from "./features/auth/user/signup/UserSignupPage";
import OtpVerificationPage from "./features/auth/user/otp/OtpVerificationPage";
import AdminLoginPage from "./features/auth/admin/login/AdminLoginPage";
import AdminLayout from "./features/admin/AdminLayout";
import AdminDashboard from "./features/admin/dashboard/AdminDashboard";
import AuthGuard from "./components/protectors/auth-guard";
import UserLayout from "./features/user/UserLayout";
import UserDashboard from "./features/user/dashboard/DashboardPage";
import { Toaster } from "sonner";
import Problems from "./features/user/problems/ProblemsPage";
import Editor from "./features/user/editor/EditorPage";
import Settings from "./features/user/settings/SettingsPage";
import Leaderboard from "./features/user/leaderboard/LeaderboardPage";
import UserProfile from "./features/user/profile/UserProfile";
import AdminProblems from "./features/admin/problems/AdminProblems";
import AdminSettings from "./features/admin/settings/AdminSettings";
import ProblemDetailsPage from "./features/admin/problems/AdminProblemDetails";

const App = () => {
  return (
    <BrowserRouter>    
        <Toaster
        position="top-right"
        theme="dark"
        richColors
        duration={4000}
      />
        <Routes>
    
        {/* Landing route */}

        <Route element={<LandingLayout/>}>

        <Route path="/" element={<LandingPage/>} />

        </Route>

        {/* Auth routes */}

        <Route element={<AuthLayout/>}>
          <Route path="/login" element={<UserLoginPage />} />
          <Route path="/signup" element={<UserSignupPage />} />
          <Route path="/signup/verify-otp" element={<OtpVerificationPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
        </Route>

        {/* User routes */}

        <Route path="/" element={
          <AuthGuard role="USER">
            <UserLayout/>
          </AuthGuard>
        } >

          <Route path="dashboard" element={<UserDashboard/>} />
          <Route path="problems" element={<Problems/>} />
          <Route path="editor" element={<Editor/>}/>
          <Route path="settings" element={<Settings/>}/>
          <Route path="leaderboard" element={<Leaderboard/>} />
          <Route path="profile" element={<UserProfile/>} />
        </Route>

        {/* Admin routes */}

        <Route path="/admin/" element={
          <AuthGuard role="ADMIN" >
          <AdminLayout/>
          </AuthGuard>
          } >
  
          <Route path="dashboard" element={<AdminDashboard/>} />
          <Route path="problems" element={<AdminProblems/>}/>
          <Route path="problems/:problemId" element={<ProblemDetailsPage/>}/>
          <Route path="settings" element={<AdminSettings/>}/>
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App
