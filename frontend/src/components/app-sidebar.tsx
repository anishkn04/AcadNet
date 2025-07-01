import { User, Home, Bell, Settings, Info } from "lucide-react";

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
import { Link } from "react-router-dom";
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
    //url: "/login",
    icon: User,
  },
  {
    title: "Notifications",
    //url: "#",
    icon: Bell,
  },
  {
    title: "Support",
    //url: "#",
    icon: Info,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

export function AppSidebar() {
  const {user} = useData()
  return (
    <Sidebar  >
      <SidebarContent >
        <SidebarGroup >
          <SidebarGroupLabel className="text-2xl font-bold text-blue-500 flex justify-center py-8">
            <p>{user}</p>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu >
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="pl-14 py-5">
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
