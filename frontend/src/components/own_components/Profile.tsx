import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/userContext";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/Avatar";
import { Link } from "react-router-dom";
import { useData } from "@/hooks/userInfoContext";
export default function Profile() {
  const { logout } = useAuth();
  const {user} = useData()
  const header = user.slice(0,2).toUpperCase()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer w-10 h-10 ">
          <AvatarImage  src="" />
          <AvatarFallback className="bg-blue-300/50">{header}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 mt-5 caret-transparent" align="center">
        <DropdownMenuLabel className="font-medium text-lg">{user}</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link to="/user">Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">Settings</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">Support</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout} className="cursor-pointer">Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
