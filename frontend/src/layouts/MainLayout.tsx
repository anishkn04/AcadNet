import { Outlet } from "react-router-dom";

import { Header } from "@/components/own_components/Header";
import { Footer } from "@/components/own_components/Footer";

const MainLayout = () => {
  return (
    <div className=" select-none overflow-hidden">
      <Header />
      <main >
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
