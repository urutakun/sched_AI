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
        accessorKey: "id",
        header: () => <div className="font-bold uppercase">ID</div>,
    },
    {
        id: "course_assignment_id",
        header: ({ column }) => {
            return (
                <div
                    className="font-bold uppercase flex cursor-pointer hover:text-black ctransition"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Course Assignment
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
            );
        },
        cell: ({ row }) => (
          <span>{`${row.original.course_assignment_id} - ${row.original.course_assignment_id}`}</span>
        )
    },
    {
        id: "room_id",
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
          <span>{row.original.room_id}</span>
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
                    Day of Week
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
            );
        },
        cell: ({ row }) => (
          <span>{row.original.day_of_week}</span>
        )
    },
    {
        id: "start_time",
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
        cell: ({ row }) => (
          <span>{row.original.start_time}</span>
        )
    },
    {
        id: "end_time",
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
        cell: ({ row }) => (
          <span>{row.original.end_time}</span>
        )
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
