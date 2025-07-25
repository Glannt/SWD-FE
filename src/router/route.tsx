import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../layout/AppLayout";
import ChatBotPage from "../pages/ChatBotPage";
import ProfilePage from "../pages/ProfilePage";
import SignIn from "../pages/AuthPages/SignIn";
import SignUp from "../pages/AuthPages/SignUp";
import ForgotPassword from "../pages/AuthPages/ForgotPassword";
// import ResetPassword from "../pages/AuthPages/ResetPassword";
import NotFound from "../pages/OtherPage/NotFound";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import UnauthorizedPage from "../components/auth/UnauthorizedPage";
import { ScrollToTop } from "../components/common/ScrollToTop";
import { UserRole } from "../types/api";
import AdminDashboard from "../pages/Dashboard/AdminDashboard";
import HomePage from "../pages/HomePage";
import UserManagement from "../pages/Dashboard/UserManagement";
import ChatSessionManagement from "../pages/Dashboard/ChatSessionManagement";
import AdminPage from "../pages/Dashboard/AdminPage";
import ProfileContent from "../components/profile/ProfileContent";
import SettingsContent from "../components/profile/SettingsContent";
import ResetPassword from "../pages/AuthPages/ResetPassword";
import OAuthCallback from "../pages/OauthCallBack";
import UploadDocumentsPage from "../pages/Dashboard/UploadDocumentsPage";
import VerifySuccess from "../pages/VerifySuccess";
import VerifyFail from "../pages/VerifyFail";

// Wrapper component để bao gồm ScrollToTop trong Router context
const AppLayoutWithScroll = () => (
  <>
    <ScrollToTop />
    <AppLayout />
  </>
);

// Admin children routes tách riêng cho clean code
// const adminChildrenRoutes = [
//   {
//     path: "users",
//     element: <UserManagement />,
//   },
//   {
//     path: "chat-sessions",
//     element: <ChatSessionManagement />,
//   },
// ];

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayoutWithScroll />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "chat",
        element: (
          <ProtectedRoute
            allowedRoles={[UserRole.STUDENT, UserRole.ADMIN]}
            redirectTo="/auth/signin"
          >
            <ChatBotPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute
            allowedRoles={[UserRole.STUDENT, UserRole.ADMIN]}
            redirectTo="/auth/signin"
          >
            <ProfilePage />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <ProfileContent />,
          },
          {
            path: "settings",
            element: <SettingsContent />,
          },
        ],
      },
      {
        path: "student",
        element: (
          <ProtectedRoute
            allowedRoles={[UserRole.STUDENT]}
            redirectTo="/auth/signin"
          >
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">Student Dashboard</h1>
              <p>Chỉ student mới có thể truy cập trang này.</p>
            </div>
          </ProtectedRoute>
        ),
      },
      {
        path: "admin",
        element: (
          <ProtectedRoute
            allowedRoles={[UserRole.ADMIN]}
            redirectTo="/auth/signin"
          >
            <AdminPage />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: "users", element: <UserManagement /> },
          { path: "chat-sessions", element: <ChatSessionManagement /> },
          {
            path: "upload-documents",
            element: (
              <ProtectedRoute
                allowedRoles={[UserRole.ADMIN]}
                redirectTo="/auth/signin"
              >
                <UploadDocumentsPage />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: "unauthorized",
        element: <UnauthorizedPage />,
      },
    ],
  },
  {
    path: "/auth",
    element: <AppLayoutWithScroll />,
    children: [
      {
        path: "signin",
        element: <SignIn />,
      },
      {
        path: "signup",
        element: <SignUp />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
    ],
  },

  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
  {
    path: "/oauth-callback",
    element: <OAuthCallback />,
  },
  {
    path: "/verify-success",
    element: <VerifySuccess />,
  },
  {
    path: "/verify-fail",
    element: <VerifyFail />,
  },
]);
