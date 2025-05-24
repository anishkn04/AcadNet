import { Button } from "@/components/ui/button"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import MainLayout from "./layouts/MainLayout"
import Hero from "./pages/Hero"
import Login from "./pages/Login"
import Register from "./pages/Register"

function App() {
  const router = createBrowserRouter([
    {
      element:<MainLayout/>,
      children:[
        {
          path:'/',
          element:<Hero/>
        },
        {
          path:'/login',
          element:<Login/>
        },
        {
          path:'/register',
          element:<Register/>
        }
      ]
    }
  ])
  return (
    <RouterProvider router={router}/>
  )
}

export default App
