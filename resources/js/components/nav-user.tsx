"use client"

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  LogOut,
  CircleUser,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { router, usePage } from "@inertiajs/react"
import NotificationsModal from "@/Pages/Components/NotificationsModal"
import axios from "axios"
import { useState, useEffect } from "react"

export function NavUser({
  user,
}: {
  user: {
    name: string
    role: string
    avatar: string
  }
}) {
  const { isMobile } = useSidebar()

  const handleLogout = (): void => {
    router.post('/auth/logout');
  }

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const role = usePage().props.auth.user.role;

  useEffect(() => {
    fetchUnreadCount();
  }, [])

  const fetchUnreadCount = async () => {
    try {
      const response = await axios.get('/notifications/unread-count');
      setUnreadCount(response.data);
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs capitalize">{user.role}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal cursor-pointer">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs capitalize">{user.role}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.visit(`/${role}/profile`)}>
                <CircleUser />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsOpen(true)}>
                <Bell />
                Notifications
                {unreadCount > 0 && (
                  <div className="count bg-red-600 min-w-6 text-center text-red-200 rounded-full ml-auto">
                    {unreadCount}
                  </div>
                )}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
      <NotificationsModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        refreshUnreadCount={fetchUnreadCount}
      />
    </SidebarMenu>
  )
}
