import { User, Home, Settings, Users } from "lucide-react";
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
    <div className="bg-white shadow-lg layout-content-container flex flex-col w-80 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-blue-600 rounded-full text-white">
          <User className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-slate-900 text-lg font-semibold leading-tight">AcadNet</h1>
          <p className="text-slate-500 text-sm font-normal leading-normal">Welcome, {user}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.url);
          return (
            <Link
              key={item.title}
              to={item.url}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors duration-150 ${
                active
                  ? "bg-blue-100 text-blue-700"
                  : "hover:bg-slate-100 text-slate-700"
              }`}
            >
              <Icon className={`h-5 w-5 ${active ? "text-blue-700" : "text-slate-600"}`} />
              <p className="text-sm font-medium">{item.title}</p>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
