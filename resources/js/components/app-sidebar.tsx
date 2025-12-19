import * as React from "react";
import {
    Users,
    Book,
    Building,
    House,
    DoorOpen,
    Calendar1,
    UserCog,
    GraduationCap,
    BookHeart,
    School,
    CalendarCheck,
    CalendarOff,
    UserRound
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
import { usePage } from "@inertiajs/react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const user = usePage().props.auth.user;
    const userData = {
      name: `${user.first_name} ${user.last_name}`,
      role: user.role,
      avatar: user.avatar ?? '/assets/images/avatar/default.png'
    }

    const adminNav = [
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
            title: "Programs",
            icon: BookHeart,
            items: [
              {
                title: "Program List",
                url: "/admin/programs"
              },
              {
                title: "Create",
                url: "/admin/programs/create"
              }
            ]
        },
        {
            title: "Deans",
            icon: UserRound,
            items: [
              {
                title: "Deans List",
                url: "/admin/deans"
              },
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
            ]
        },
        {
            title: "Students",
            icon: GraduationCap,
            items: [
              {
                title: "Student List",
                url: "/admin/students"
              },
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
              },
              {
                title: "Course Assignments",
                url: "/admin/course-assignments/"
              }
            ]
        },
        {
            title: "Schedule",
            icon: CalendarCheck,
            items: [
              {
                title: "Schedule List",
                url: "/admin/schedules"
              },
              {
                title: "Create",
                url: "/admin/schedules/create"
              },
              {
                title: "Cancel Requests",
                url: "/admin/schedules/cancel-request"
              },
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
        {
            title: "Academic Management",
            icon: School,
            items: [
              {
                title: "Academic Years",
                url: "/admin/academic-years/"
              },
              {
                title: "Create Academic Year",
                url: "/admin/academic-years/create"
              },
              {
                title: "Trimesters",
                url: "/admin/trimesters/"
              },
              {
                title: "Create Trimester",
                url: "/admin/trimesters/create"
              }
            ]
        },
    ]

    const studentNav = [
      {
        title: "Dashboard",
        url: '/student/dashboard',
        icon: House
      }
    ]

    const InstructorNav = [
      {
        title: "Dashboard",
        url: '/instructor/dashboard',
        icon: House
      },
      {
        title: "Cancellation Requests",
        url: '/instructor/schedules/cancel-request',
        icon: CalendarOff
      }
    ]

    const roleNavMap: Record<string, any[]> = {
      admin: adminNav,
      student: studentNav,
      instructor: InstructorNav
    }

    const navMain = roleNavMap[userData.role] ?? [];

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
                        <span className="truncate font-bold text-xl tracking-tighter font-dm">SchedAI</span>
                    </div>
                </SidebarMenuButton>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={navMain} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={userData} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
