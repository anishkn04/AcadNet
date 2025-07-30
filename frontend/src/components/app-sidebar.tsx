import { User, Home, Settings, Users } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { useData } from "@/hooks/userInfoContext";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "My Profile",
    url: "/user",
    icon: User,
  },
  {
    title: "My Group",
    url: "/user/mygroup",
    icon: Users,
  },
  {
    title: "Settings",
    url: "/user/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const { user } = useData();
  const location = useLocation();

  const isActive = (url: string) => {
    if (url === "/") {
      return location.pathname === "/";
    }
    if (url === "/user") {
      return location.pathname === "/user";
    }
    if (url === "/user/mygroup") {
      return (
        location.pathname === "/user/mygroup" ||
        location.pathname === "/user/groupadmin"
      );
    }
    if (url === "/user/settings") {
      return location.pathname === "/user/settings";
    }
    return location.pathname === url || location.pathname.startsWith(url + "/");
  };
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-2xl font-bold text-blue-500 flex justify-center py-8">
            <p>{user}</p>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="pl-14 py-5 data-[active=true]:bg-blue-100 data-[active=true]:text-blue-700"
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                  >
                    <Link to={item.url ?? "#"}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {/* <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>hello</SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter> */}
    </Sidebar>
  );
}
