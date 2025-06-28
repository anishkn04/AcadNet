import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Login from "../pages/Login";
import Register from "../pages/Register";
import { Home } from "../pages/Home";
import CreateGroup from "../pages/CreateGroup";
import JoinGroup from "../pages/JoinGroup";

import UserLayout from "../layouts/UserLayout";
import ProtectedRoutes from "./ProtectedRoutes";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage ";
import OtpFerification from "@/pages/OtpFerification";
import UserProfile from "@/pages/UserProfile";
import StudyPlatform from "@/pages/StudyPlatform";
import LoadingPage from "@/pages/LoadingPage";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },

      {
        path: "join",
        element: (
          <ProtectedRoutes>
            <CreateGroup />
          </ProtectedRoutes>
        ),
      },
      {
        path: "create",
        element: (
          <ProtectedRoutes>
            <JoinGroup />
          </ProtectedRoutes>
        ),
      },
      {
        path: "group",
        element: (
          <ProtectedRoutes>
            <StudyPlatform/>
          </ProtectedRoutes>
        ),
      },
    ],
  },
  {
    path: "/user",
    element: (
      <ProtectedRoutes>
        <UserLayout />
      </ProtectedRoutes>
    ),
    children: [{ index: true, element: <UserProfile /> }],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/forgot",
    element: <ForgotPasswordPage />,
  },
  {
    path: "/otpverification",
    element: <OtpFerification />,
  },
]);
