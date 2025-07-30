// import React from 'react'
import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

const UserLayout = () => {
  return (
    <SidebarProvider className="select-none" defaultOpen={true}>
      <AppSidebar />
      <main className="flex-1 overflow-auto min-w-0">
        <div className="sticky top-0 z-40 bg-background border-b p-2">
          <SidebarTrigger />
        </div>
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
};

export default UserLayout;
