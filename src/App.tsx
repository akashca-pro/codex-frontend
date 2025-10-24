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
import Problems from "./features/problems/problemList/ProblemsPage";
import Leaderboard from "./features/user/leaderboard/LeaderboardPage";
import UserProfile from "./features/user/profile/UserProfile";
import AdminProblems from "./features/admin/problems/AdminProblems";
import ProblemDetailsPage from "./features/admin/problems/AdminProblemDetails";
import CodePad from "./features/CodePad/CodePad";
import ProblemDetails from "./features/problems/problemDetails/ProblemDetailsPage";
import UsersList from "./features/admin/users/UsersList";
import NotFoundPage from "./components/NotFound";
import AdminProfile from "./features/admin/profile/AdminProfile";
import ForgotPasswordPage from "./features/auth/user/forgotPassword/ForgotPasswordPage";
import CollaborationPage from "./features/collaboration/CollaborationPage";

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
          <Route path="/login/forgot-password" element={<ForgotPasswordPage/>} />
          <Route path="/signup" element={<UserSignupPage />} />
          <Route path="/signup/verify-otp" element={<OtpVerificationPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
        </Route>

        {/* Public routes */}

        <Route path="/">

          <Route path="problems">
            <Route index element={<Problems/>}/>
            <Route path=":problemId" element={<ProblemDetails/>}/>
          </Route>

          <Route path="codepad" element={<CodePad/>}/>
        </Route>

        {/* User routes */}

        <Route path="/user/" element={
          <AuthGuard role="USER">
            <UserLayout/>
          </AuthGuard>
        } >
          <Route path="dashboard" element={<UserDashboard/>} />
          <Route path="leaderboard" element={<Leaderboard/>} />
          <Route path="profile" element={<UserProfile/>} />
          <Route path="collab" element={<CollaborationPage/>} />
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
          <Route path="users" element={<UsersList/>}/>
          <Route path="profile" element={<AdminProfile/>}/>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>


    </BrowserRouter>
  )
}

export default App
