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
import type { Instructor } from "../Interfaces/Instructor"

export const DeanInstructorColumns = (
  handleEdit: (id: string) => void,
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setDeletingId: React.Dispatch<React.SetStateAction<string>>,
): ColumnDef<Instructor>[] => [
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
    id: "instuctor_type",
    header: ({ column }) => {
      return(
        <div
        className="font-bold uppercase flex cursor-pointer hover:text-black ctransition"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Instructor Type
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      )
    },
    cell: ({ row }) => {
      const color = {
        'part-time': 'bg-yellow-200 text-yellow-600',
        'full-time': 'bg-blue-200 text-blue-600',
      }
      return(
        <div className={`
        capitalize ${color[row.original.instructor_type]}
        px-3 py-1 rounded-full max-w-[90px] text-center
        `}>
          {row.original.instructor_type}
        </div>
      )
    }
  },
  {
    accessorKey: "department.name",
    header: ({ column }) => {
      return(
        <div
        className="font-bold uppercase flex cursor-pointer hover:text-black ctransition"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Department
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      )
    },
  },
  {
    accessorKey: "max_load",
    header: ({ column }) => {
      return(
        <div
        className="font-bold uppercase flex cursor-pointer hover:text-black ctransition"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Max Load
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
