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
import type { Trimester as TrimesterType } from "../Interfaces/Trimester"

const formatDate = (d: string): string => {
  const date = new Date(d);
  const formatted_date = date.toLocaleDateString('en-US', {month: 'long', day: 'numeric', year:'numeric'})
  return formatted_date;
}


export const TrimesterColumns = (
    handleEdit: (id: string) => void,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    setDeletingId: React.Dispatch<React.SetStateAction<string>>
): ColumnDef<TrimesterType>[] => [
  {
    accessorKey: "id",
    header: () => <div className="font-bold uppercase">ID</div>,
  },
  {
    accessorKey: "academic_years_id",
    header: ({ column }) => {
      return(
        <div
        className="font-bold uppercase flex cursor-pointer hover:text-black ctransition"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Academic Year
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      )
    },
    cell: ({row}) => {
      console.log(row);
      const academic_year = `${row.original.academic_year.year_start} - ${row.original.academic_year.year_end}`;
      return(
        <span>AY {academic_year}</span>
      );
    }
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return(
        <div
        className="font-bold uppercase flex cursor-pointer hover:text-black ctransition"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      )
    }
  },
  {
    accessorKey: "start_date",
    header: ({ column }) => {
      return(
        <div
        className="font-bold uppercase flex cursor-pointer hover:text-black ctransition"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Start Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      )
    },
    cell: ({row}) => {
      const date = formatDate(row.original.start_date);
      return(
        <span>{date}</span>
      )
    }
  },
  {
    accessorKey: "end_date",
    header: ({ column }) => {
      return(
        <div
        className="font-bold uppercase flex cursor-pointer hover:text-black ctransition"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          End Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      )
    },
    cell: ({row}) => {
      const date = formatDate(row.original.end_date);
      return(
        <span>{date}</span>
      )
    }
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return(
        <div
        className="font-bold uppercase flex cursor-pointer hover:text-black ctransition"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      )
    },
    cell: ({ row }) => {
      const color = {
        'active': 'bg-blue-500',
        'inactive': 'bg-gray-300'
      }

      return(
        <div className="flex items-center space-x-2">
          <span className="capitalize min-w-[40px]">{row.original.status}</span>
          <div className={`${color[row.original.status]} w-3 h-3 rounded-full`}></div>
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
            <Button variant="ghost" className="h-8 w-8 p-0 focus-visible:ring-0">
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
      )
    }
  },
]
