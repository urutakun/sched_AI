"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Schedule } from "../Interfaces/Schedule";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const ScheduleColumns = (
    handleEdit: (id: string) => void,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    setDeletingId: React.Dispatch<React.SetStateAction<string>>
): ColumnDef<Schedule>[] => [
    {
        id: "academic_year",
        accessorKey: "academic_year",
        header: ({ column }) => {
            return (
                <div
                    className="font-bold uppercase flex cursor-pointer hover:text-black ctransition"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Academic Year
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
            );
        },
        cell: ({ row }) => (
          <span>{`${row.original.academic_year.year_start} - ${row.original.academic_year.year_end}`}</span>
        )
    },
    {
        id: "trimester",
        accessorKey: "trimester",
        header: ({ column }) => {
            return (
                <div
                    className="font-bold uppercase flex cursor-pointer hover:text-black ctransition"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Trimester
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
            );
        },
        cell: ({ row }) => (
          <span>{row.original.trimester.name}</span>
        )
    },
    {
        id: "department_name",
        accessorFn: (row) => row.department.name ?? "N/A",
        header: ({ column }) => {
            return (
                <div
                    className="font-bold uppercase flex cursor-pointer hover:text-black ctransition"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Department
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
            );
        },
        cell: ({ row }) => (
          <span>{row.original.department.name}</span>
        )
    },
    {
        id: "course_assignment_course",
        accessorFn: (row) => row.course_assignment.course.name,
        header: ({ column }) => {
            return (
                <div
                    className="font-bold uppercase flex cursor-pointer hover:text-black ctransition"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Course
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
            );
        },
        cell: ({ row }) => (
          <span>{row.original.course_assignment.course.name}</span>
        )
    },
    {
        id: "course_assignment_instructor",
        accessorFn: (row) => row.course_assignment.instructor.last_name,
        header: ({ column }) => {
            return (
                <div
                    className="font-bold uppercase flex cursor-pointer hover:text-black ctransition"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Instructor
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
            );
        },
        cell: ({ row }) => {
          const instructor = row.original.course_assignment.instructor.user;
          return(
            <span>{`${instructor.first_name} ${instructor.last_name}`}</span>
          )
        }
    },
    {
        id: "room_id",
        accessorFn: (row) => row.room.room_name,
        header: ({ column }) => {
            return (
                <div
                    className="font-bold uppercase flex cursor-pointer hover:text-black ctransition"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Room
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
            );
        },
        cell: ({ row }) => (
          <span>{row.original.room.room_name}</span>
        )
    },
    {
        id: "day_of_week",
        header: ({ column }) => {
            return (
                <div
                    className="font-bold uppercase flex cursor-pointer hover:text-black ctransition"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Days of Week
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
            );
        },
        cell: ({ row }) => {
          const days = row.original.days.join(", ");
          return(
            <span>{days}</span>
          )
        }
    },
    {
        id: "start_time",
        accessorKey: "start_time",
        header: ({ column }) => {
            return (
                <div
                    className="font-bold uppercase flex cursor-pointer hover:text-black ctransition"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Start Time
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
            );
        },
        cell: ({ row }) => {
          const rawTime = row.original.start_time;
          let date;
          if (/^\d{2}:\d{2}(:\d{2})?$/.test(rawTime)) {
            const today = new Date();
            const [hours, minutes, seconds] = rawTime.split(":").map(Number);
            date = new Date(
              today.getFullYear(),
              today.getMonth(),
              today.getDate(),
              hours,
              minutes,
              seconds || 0
            );
          } else {
            date = new Date(rawTime);
          }

          const time = date.toLocaleTimeString("en-US", {
            hour12: true,
            hour: "2-digit",
            minute: "2-digit",
          });

          return(
            <span>{time}</span>
          )
      }
    },
    {
        id: "end_time",
        accessorKey: "end_time",
        header: ({ column }) => {
            return (
                <div
                    className="font-bold uppercase flex cursor-pointer hover:text-black ctransition"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    End Time
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
            );
        },
        cell: ({ row }) => {
          const rawTime = row.original.end_time;
          let date;
          if (/^\d{2}:\d{2}(:\d{2})?$/.test(rawTime)) {
            const today = new Date();
            const [hours, minutes, seconds] = rawTime.split(":").map(Number);
            date = new Date(
              today.getFullYear(),
              today.getMonth(),
              today.getDate(),
              hours,
              minutes,
              seconds || 0
            );
          } else {
            date = new Date(rawTime);
          }

          const time = date.toLocaleTimeString("en-US", {
            hour12: true,
            hour: "2-digit",
            minute: "2-digit",
          });

          return(
            <span>{time}</span>
          )
      }
    },
    {
        accessorKey: "status",
        header: ({ column }) => {
            return (
                <div
                    className="font-bold uppercase flex cursor-pointer hover:text-black ctransition"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
            );
        },
        cell: ({ row }) => {
        const bg_colors: Record<string,string> = {
          active: 'bg-blue-200',
          pending_cancel: 'bg-gray-200',
          cancelled: 'bg-red-200',
          completed: 'bg-green-200'
        }

        const text_colors: Record<string,string> = {
          active: 'text-blue-600',
          pending_cancel: 'text-gray-600',
          cancelled: 'text-red-600',
          completed: 'text-green-600'
        }

        const formattedStatus = {
          active: 'Active',
          pending_cancel: 'Pending',
          cancelled: 'Cancelled',
          completed: 'Completed'
        }

        return(
          <div className={`${bg_colors[row.original.status]} ${text_colors[row.original.status]} max-w-[120px] px-4 py-1 rounded-2xl text-center`}>
            <span>{formattedStatus[row.original.status]}</span>
          </div>
        )
      }
    },
    {
        id: "actions",
        header: () => <div className="font-bold uppercase">Actions</div>,
        cell: ({ row }) => {
            const handleDelete = (id: string) => {
              setDeletingId(id);
              setIsOpen(true);
            }
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="h-8 w-8 p-0 focus-visible:ring-0"
                        >
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEdit(row.original.id)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(row.original.id)}>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
