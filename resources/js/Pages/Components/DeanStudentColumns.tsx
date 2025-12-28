"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Student } from "../Interfaces/Student"

export const DeanStudentColumns = (
  handleEdit: (id: string) => void,
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setDeletingId: React.Dispatch<React.SetStateAction<string>>,
): ColumnDef<Student>[] => [
  {
    accessorKey: "user.first_name",
    header: ({ column }) => {
      return(
        <div
        className="font-bold uppercase flex cursor-pointer hover:text-black ctransition"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          First Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      )
    },
  },
  {
    id: "user.last_name",
    accessorFn: (row) => row.user.last_name,
    header: ({ column }) => {
      return(
        <div
        className="font-bold uppercase flex cursor-pointer hover:text-black ctransition"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Last Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      )
    },
  },
  {
    accessorKey: "year",
    header: ({ column }) => {
      return(
        <div
        className="font-bold uppercase flex cursor-pointer hover:text-black ctransition"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Year
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      )
    },
  },
  {
    accessorKey: "section",
    header: ({ column }) => {
      return(
        <div
        className="font-bold uppercase flex cursor-pointer hover:text-black ctransition"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Year
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      )
    },
  },
  {
    accessorKey: "program.name",
    header: ({ column }) => {
      return(
        <div
        className="font-bold uppercase flex cursor-pointer hover:text-black ctransition"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Program
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      )
    },
  },
  {
    accessorKey: "user.email",
    header: () => <div className="font-bold uppercase">Email</div>,
  },
]
