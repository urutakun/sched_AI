import * as React from "react";
import {
    Users,
    Book,
    Building,
    House,
    DoorOpen,
    Calendar1,
    UserCog,
} from "lucide-react";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenuButton,
    SidebarRail,
} from "@/components/ui/sidebar";
import Logo from "@/Pages/Components/Logo";

const data = {
    user: {
        name: "John Doe",
        role: "Admin",
        avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
        // {
        //   title: "Playground",
        //   url: "#",
        //   icon: Book,
        //   isActive: true,
        //   items: [
        //     {
        //       title: "History",
        //       url: "#",
        //     },
        //     {
        //       title: "Starred",
        //       url: "#",
        //     },
        //     {
        //       title: "Settings",
        //       url: "#",
        //     },
        //   ],
        // },
        {
            title: "Dashboard",
            url: "/admin/dashboard",
            icon: House,
        },
        {
            title: "Departments",
            icon: Building,
            items: [
              {
                title: "Department List",
                url: "/admin/departments"
              },
              {
                title: "Create",
                url: "/admin/departments/create"
              }
            ]
        },
        {
            title: "Instructors",
            icon: Users,
            items: [
              {
                title: "Instructor List",
                url: "/admin/instructors"
              },
              {
                title: "Create",
                url: "/admin/instructors/create"
              }
            ]
        },
        {
            title: "Courses",
            icon: Book,
            items: [
              {
                title: "Course List",
                url: "/admin/courses"
              },
              {
                title: "Create",
                url: "/admin/courses/create"
              }
            ]
        },
        {
            title: "Rooms",
            icon: DoorOpen,
            items: [
              {
                title: "Room List",
                url: "/admin/rooms"
              },
              {
                title: "Create",
                url: "/admin/rooms/create"
              }
            ]
        },
        {
            title: "Events",
            icon: Calendar1,
            items: [
              {
                title: "Event List",
                url: "/admin/events"
              },
              {
                title: "Create",
                url: "/admin/events/create"
              }
            ]
        },
        {
            title: "User Management",
            icon: UserCog,
            items: [
              {
                title: "User List",
                url: "/admin/user-management/"
              },
              {
                title: "Create",
                url: "/admin/user-management/create"
              }
            ]
        },
    ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar
            collapsible="icon"
            {...props}
            className="border-none shadow-md"
        >
            <SidebarHeader>
                <SidebarMenuButton size="lg" className="flex items-center">
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-custom-secondary text-sidebar-primary-foreground">
                        <Logo width={20} height={20} color={'white'} isVisible={false} />
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">SchedAI</span>
                    </div>
                </SidebarMenuButton>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
