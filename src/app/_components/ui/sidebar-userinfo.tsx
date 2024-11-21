import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/_components/ui/avatar";
import type { User } from "next-auth";

export function SidebarUserInfo({ user }: { user?: User }) {
  return (
    <>
      <Avatar className="h-8 w-8 rounded-lg">
        <AvatarImage src={user?.image || ""} alt={user?.name || ""} />
        <AvatarFallback className="rounded-lg">
          {user?.name?.slice(0, 2)}
        </AvatarFallback>
      </Avatar>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-semibold">{user?.name || ""}</span>
        <span className="truncate text-xs">{user?.email}</span>
      </div>
    </>
  );
}
