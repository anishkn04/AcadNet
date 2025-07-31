import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

const UserLayout = () => {
  return (
    <div className="relative flex size-full min-h-screen flex-col group/design-root overflow-x-hidden bg-slate-100" style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}>
      <div className="layout-container flex h-full grow flex-col">
        <div className="flex flex-1">
          <SidebarProvider className="select-none" defaultOpen={true}>
            <AppSidebar />
            <main className="layout-content-container flex flex-col flex-1 bg-slate-100">
              <div className="sticky top-0 z-40 bg-white shadow-sm border-b border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <SidebarTrigger className="h-8 w-8 text-slate-600 hover:bg-slate-100" />
                  <div className="h-6 w-px bg-slate-200" />
                  <div className="flex-1">
                    <div className="text-slate-900 text-xl font-semibold leading-tight">
                      Dashboard
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1 p-8">
                <Outlet />
              </div>
            </main>
          </SidebarProvider>
        </div>
      </div>
    </div>
  );
};

export default UserLayout;
