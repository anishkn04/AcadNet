import { User, Home, Settings, Users, Shield } from "lucide-react";

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

import { Avatar, AvatarFallback } from "@/components/ui/Avatar";
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
    title: "My Groups",
    url: "/user/mygroup",
    icon: Users,
  },
  {
    title: "Settings",
    url: "/user/settings",
    icon: Settings,
  },
  {
    title: "System Admin",
    url: "/user/sysadmin",
    icon: Shield,
  },
];

export function AppSidebar() {
  const { user, userProfile } = useData();
  // Determine if user is sysadmin
  const isSysAdmin = userProfile && userProfile.role === "admin";
  const location = useLocation();

  // Helper function to generate avatar initials
  const getAvatarInitials = (username: string): string => {
    if (!username) return "UN";

    if (username.toLowerCase().startsWith("user")) {
      // For usernames like "user1", "user123", use 'U' + number
      const numberPart = username.replace(/^user/i, "");
      return numberPart ? `U${numberPart.slice(0, 1)}` : "UN";
    } else {
      // For normal usernames, use first two characters
      return username.slice(0, 2).toUpperCase();
    }
  };

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
    if (url === "/user/sysadmin") {
      return location.pathname === "/user/sysadmin";
    }
    return location.pathname === url || location.pathname.startsWith(url + "/");
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        {/* Avatar section for collapsed sidebar */}
        <div className="hidden group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:py-1">
          <Avatar className="w-10 h-10">
            <AvatarFallback className="bg-blue-300/50 text-blue-800 font-semibold text-sm">
              {getAvatarInitials(userProfile?.username || user || "")}
            </AvatarFallback>
          </Avatar>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-2xl font-bold text-blue-500 flex justify-center py-8 group-data-[collapsible=icon]:hidden">
            {/* Show username when expanded */}
            {userProfile?.username || user}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items
                .filter((item) => item.title !== "System Admin" || isSysAdmin)
                .map((item) => (
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
