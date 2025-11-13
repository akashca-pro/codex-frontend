import './index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/jetbrains-mono';
import App from './App'
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from '@/store';
import { GoogleOAuthProvider } from '@react-oauth/google'
import { setupMonacoEnvironment } from './lib/setupMonacoEnvironment';
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// --- All layouts and pages ---
import AuthLayout from "./features/auth/AuthLayout";
import LandingLayout from "./features/landing/LandingLayout";
import LandingPage from "./features/landing/landing/LandingPage";
import UserLoginPage from "./features/auth/user/login/UserLoginPage";
import UserSignupPage from "./features/auth/user/signup/UserSignupPage";
import OtpVerificationPage from "./features/auth/user/otp/OtpVerificationPage";
import AdminLoginPage from "./features/auth/admin/login/AdminLoginPage";
import AdminLayout from "./features/admin/AdminLayout";
import AuthGuard from "./components/protectors/auth-guard";
import UserLayout from "./features/user/UserLayout";
import UserDashboard from "./features/user/dashboard/DashboardPage";
import Problems from "./features/problems/problemList/ProblemsPage";
import Leaderboard from "./features/user/leaderboard/LeaderboardPage";
import UserProfile from "./features/user/profile/UserProfile";
import AdminProblems from "./features/admin/problems/AdminProblems";
import ProblemDetailsPage from "./features/admin/problems/AdminProblemDetails";
import CodePad from "./features/CodePad/CodePad";
import ProblemDetails from "./features/problems/problemDetails/ProblemDetailsPage";
import UsersList from "./features/admin/users/UsersList";
import NotFoundPage from "./components/NotFound";
import ForgotPasswordPage from "./features/auth/user/forgotPassword/ForgotPasswordPage";
import CollaborationPage from "./features/collaboration/CollaborationPage";
import { AdminDashboardNew } from './features/admin/dashboard/AdminDashboard';

const router = createBrowserRouter([
  {
    element: <App />, 
    errorElement: <NotFoundPage />, 
    children: [
      // Landing route
      {
        element: <LandingLayout/>,
        children: [
          { path: "/", element: <LandingPage/> }
        ]
      },
      // Auth routes
      {
        element: <AuthLayout/>,
        children: [
          { path: "/login", element: <UserLoginPage /> },
          { path: "/login/forgot-password", element: <ForgotPasswordPage/> },
          { path: "/signup", element: <UserSignupPage /> },
          { path: "/signup/verify-otp", element: <OtpVerificationPage /> },
          { path: "/admin/login", element: <AdminLoginPage /> }
        ]
      },
      // Public routes
      {
        path: "/",
        children: [
          {
            path: "problems",
            children: [
              { index: true, element: <Problems/> },
              { path: ":problemId", element: <ProblemDetails/> }
            ]
          },
          { path: "codepad", element: <CodePad/> }
        ]
      },
      // User routes
      {
        path: "/user/",
        element: (
          <AuthGuard role="USER">
            <UserLayout/>
          </AuthGuard>
        ),
        children: [
          { path: "dashboard", element: <UserDashboard/> },
          { path: "leaderboard", element: <Leaderboard/> },
          { path: "profile", element: <UserProfile/> },
          { path: "collab", element: <CollaborationPage/> }
        ]
      },
      // Admin routes
      {
        path: "/admin/",
        element: (
          <AuthGuard role="ADMIN" >
            <AdminLayout/>
          </AuthGuard>
        ),
        children: [
          { path: "dashboard", element: <AdminDashboardNew/> },
          { path: "problems", element: <AdminProblems/> },
          { path: "problems/:problemId", element: <ProblemDetailsPage/> },
          { path: "leaderboard", element: <Leaderboard/> },
          { path: "users", element: <UsersList/> },
          { path: "profile", element: <UserProfile/> }
        ]
      },
      // 404
      { path: "*", element: <NotFoundPage /> }
    ]
  }
]);

setupMonacoEnvironment();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store} >
      <PersistGate loading={<div className="text-white text-center">Loading...</div>} persistor={persistor}>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          <RouterProvider router={router} />
        </GoogleOAuthProvider>
      </PersistGate>
    </Provider>
  </StrictMode>,
)
