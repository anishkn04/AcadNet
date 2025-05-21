import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import MainLayout from './layout/main-layout'
import Hero from './pages/Hero'
import Login from './pages/Login'
import Register from './pages/Register'
const App = () => {
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