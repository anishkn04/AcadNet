import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";

import Login from "./pages/Login";
import Register from "./pages/Register";
import { Home } from "./pages/Home";
import CreateGroup from "./pages/CreateGroup";
import JoinGroup from "./pages/JoinGroup";
import { UserProvider } from "./hooks/userContext";
import UserLayout from "./layouts/UserLayout";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <UserProvider>
          <MainLayout />
        </UserProvider>
      ),
      children: [
        { index: true, element: <Home /> }, // same as path: "/"
        { path: "create", element: (<CreateGroup /> )},
        { path: "join", element: <JoinGroup /> },
      ],
    },
    {
      path:'/user',
      element:<UserLayout/>
    },
    {
      path: "/login",
      element: (
        <UserProvider>
          <Login />
        </UserProvider>
      ),
    },
    {
      path: "/register",
      element: (
        <UserProvider>
          <Register />
        </UserProvider>
      ),
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
