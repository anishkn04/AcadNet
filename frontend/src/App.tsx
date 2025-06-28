import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserProvider } from "./hooks/userContext";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/router";
import { UserInfoProvider } from "./hooks/userInfoContext";
export default function App() {
  return (
    <UserProvider>
      <UserInfoProvider>
        <RouterProvider router={router} />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            draggable
            closeOnClick
            pauseOnHover
            theme="dark"
          />
      </UserInfoProvider>
    </UserProvider>
  );
}
