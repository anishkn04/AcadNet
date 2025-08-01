import { UserProvider } from "./hooks/userContext";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/router";
import { UserInfoProvider } from "./hooks/userInfoContext";
import { ToastProvider } from "./hooks/useToast";
import GlobalToastInstance from "./components/GlobalToastInstance";

export default function App() {
  return (
    <UserProvider>
      <UserInfoProvider>
        <ToastProvider>
          <GlobalToastInstance />
          <RouterProvider router={router} />
        </ToastProvider>
      </UserInfoProvider>
    </UserProvider>
  );
}
