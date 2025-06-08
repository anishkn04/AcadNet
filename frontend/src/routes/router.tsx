import { createBrowserRouter  } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Login from "../pages/Login";
import Register from "../pages/Register";
import { Home } from "../pages/Home";
import CreateGroup from "../pages/CreateGroup";
import JoinGroup from "../pages/JoinGroup";

import UserLayout from "../layouts/UserLayout";
import ProtectedRoutes from "./ProtectedRoutes";
export const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        { index: true, element: <Home /> },
        { path: "create", element: <ProtectedRoutes><CreateGroup /></ProtectedRoutes> },
        { path: "join", element: <ProtectedRoutes><JoinGroup /></ProtectedRoutes> },
      ],
    },
    {
      path: "/user",
      element: <UserLayout />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
  ]);