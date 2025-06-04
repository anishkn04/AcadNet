// import { Button } from "@/components/ui/button"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import MainLayout from "./layouts/MainLayout"

import Login from "./pages/Login"
import Register from "./pages/Register"
import { Home } from "./pages/Home"
import CreateGroup from "./pages/CreateGroup"
import JoinGroup from "./pages/JoinGroup"
import UserLayout from "./layouts/UserLayout"

function App() {
const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/create", element: <CreateGroup/> },
      { path: "/join", element: <JoinGroup/> },
    ],
  },
  // {
  //   path: '/user',
  //   element: <UserLayout />,
  //   // You can add children here if you want nested routes under /user
  // },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
])

  return (
    <RouterProvider router={router}/>
  )
}

export default App
