"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Course } from "../Interfaces/Course";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const CourseColumns = (
    handleEdit: (id: string) => void,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    setDeletingId: React.Dispatch<React.SetStateAction<string>>
): ColumnDef<Course>[] => [
    {
        accessorKey: "id",
        header: () => <div className="font-bold uppercase">ID</div>,
    },
    {
        id: "academic_year",
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
          <span>{row.original.trimester?.name}</span>
        )
    },
    {
        id: "department",
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
        accessorKey: "code",
        header: ({ column }) => {
            return (
                <div
                    className="font-bold uppercase flex cursor-pointer hover:text-black ctransition"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Code
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
            );
        },
    },
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <div
                    className="font-bold uppercase flex cursor-pointer hover:text-black ctransition"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
            );
        },
    },
    {
        accessorKey: "units",
        header: ({ column }) => {
            return (
                <div
                    className="font-bold uppercase flex cursor-pointer hover:text-black ctransition"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Units
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
            );
        },
    },
    {
        accessorKey: "has_lab",
        header: ({ column }) => {
            return (
                <div
                    className="font-bold uppercase flex cursor-pointer hover:text-black ctransition"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Using Lab
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
            );
        },
        cell: ({ row }) => {
          const bg_colors: Record<string,string> = {
            true: 'bg-blue-200 ',
            false: 'bg-gray-200 ',
          }

          const text_colors: Record<string,string> = {
            true: 'text-blue-600 ',
            false: 'text-gray-600 ',
          }

          const hasLab = Boolean(row.original.has_lab);
          return(
            <div className={`${bg_colors[String(hasLab)]} ${text_colors[String(hasLab)]} max-w-[60px] px-4 py-1 rounded-2xl text-center`}>
              <span>{row.original.has_lab ? 'Yes' : 'No'}</span>
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
                        <DropdownMenuItem>Assign</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(row.original.id)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(row.original.id)}>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
