import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Login from "../pages/Login";
import Register from "../pages/Register";
import { Home } from "../pages/Home";
import CreateGroup from "../pages/CreateGroup";
import CreateGroupForm from "@/pages/CreateGroupForm";
import About from "@/pages/About";
import Guide from "@/pages/Guide";
import Terms from "@/pages/Terms";
import Privacy from "@/pages/Privacy";

import UserLayout from "../layouts/UserLayout";
import ProtectedRoutes from "./ProtectedRoutes";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage ";
import OtpFerification from "@/pages/OtpFerification";
import UserProfile from "@/pages/UserProfile";
import StudyPlatform from "@/pages/StudyPlatform";
import MyGroup from "@/pages/MyGroup";
import Overview from "@/pages/Overview";
import GroupAdmin from "@/pages/GroupAdmin";
import Settings from "@/pages/Settings";

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
            <CreateGroupForm />
          </ProtectedRoutes>
        ),
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "guide",
        element: <Guide />,
      },
      {
        path: "terms",
        element: <Terms />,
      },
      {
        path: "privacy",
        element: <Privacy />,
      },
      {
        path: "group",
        element: (
          <ProtectedRoutes>
            <StudyPlatform />
          </ProtectedRoutes>
        ),
      },
      {
        path: "overview",
        element: <Overview />,
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
    children: [
      {
        index: true,
        element: <UserProfile />,
      },
      {
        path: "mygroup",
        element: <MyGroup />,
      },

      {
        path: "groupadmin",
        element: <GroupAdmin />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
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
