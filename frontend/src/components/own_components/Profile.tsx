import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/userContext";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/Avatar";
import { Link } from "react-router-dom";
import { useData } from "@/hooks/userInfoContext";

export default function Profile() {
  const { logout } = useAuth();
  const { user, userProfile } = useData();

  // If user is undefined (still loading or not logged in), render a simpler avatar or null
  if (!user) {
    return (
      <Avatar className="cursor-pointer w-10 h-10">
        <AvatarFallback className="bg-gray-200 animate-pulse">
          ...
        </AvatarFallback>{" "}
        {/* Or a simple login button */}
      </Avatar>
    );
  }

  // Now, 'user' is guaranteed to be defined if we reach this point
  // Generate avatar initials intelligently
  let header = "";
  if (user.toLowerCase().startsWith("user")) {
    // For usernames like "user1", "user123", use 'U' + number
    const numberPart = user.replace(/^user/i, "");
    header = numberPart ? `U${numberPart.slice(0, 1)}` : "UN";
  } else {
    // For normal usernames, use first two characters
    header = user.slice(0, 2).toUpperCase();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer w-10 h-10 ">
          <AvatarImage src="" />
          <AvatarFallback className="bg-blue-300/50">{header}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 mt-5 caret-transparent"
        align="center"
      >
        <DropdownMenuLabel className="font-medium text-lg">
          {user}
        </DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link to="/user">My Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link to="/user/mygroup">My Group</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link to="/user/settings">Settings</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        {userProfile?.role === 'admin' && (
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link to="/user/sysadmin">System Admin</Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem onClick={logout} className="cursor-pointer">
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
