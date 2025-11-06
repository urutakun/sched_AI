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
import type { Event } from "../Interfaces/Event"
import { spawn } from "child_process"


export const EventColumns = (
    handleEdit: (id: string) => void,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    setDeletingId: React.Dispatch<React.SetStateAction<string>>
): ColumnDef<Event>[] => [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return(
        <div
        className="font-bold uppercase flex cursor-pointer hover:text-black ctransition"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      )
    },
  },
  {
    accessorKey: "description",
    header: () => <div className="font-bold uppercase">Description</div>,
  },
  {
    accessorKey: "start_datetime",
    header: ({ column }) => {
      return(
        <div
        className="font-bold uppercase flex cursor-pointer hover:text-black ctransition"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Start
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      )
    },
    cell: ({row}) => {
      const date = new Date(row.original.start_datetime);
      const formattedDate = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });

      return(
        <div className="capitalize">{formattedDate}</div>
      )
    }
  },
  {
    accessorKey: "end_datetime",
    header: ({ column }) => {
      return(
        <div
        className="font-bold uppercase flex cursor-pointer hover:text-black ctransition"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          End
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      )
    },
    cell: ({row}) => {
      const date = new Date(row.original.end_datetime);
      const formattedDate = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });

      return(
        <div className="capitalize">{formattedDate}</div>
      )
    }
  },
  {
    id: "type",
    header: ({ column }) => {
      return(
        <div
        className="font-bold uppercase flex cursor-pointer hover:text-black ctransition"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Type
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      )
    },
    cell: ({ row }) => (
      <span className="capitalize">{row.original.type}</span>
    )
  },
  {
    id: "department",
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
    cell: ({ row }) => {
      return(
        <span className="capitalize">{row.original.department?.name ?? (<span className="text-gray-400 italic">Null</span>)}</span>
      )
    }
  },
  {
    accessorKey: "location",
    header: () => <div className="font-bold uppercase">Location</div>,
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
        upcoming: 'bg-gray-200',
        ongoing: 'bg-blue-200',
        cancelled: 'bg-red-200',
        finished: 'bg-green-200'
      }

      const text_colors: Record<string,string> = {
        upcoming: 'text-gray-600',
        ongoing: 'text-blue-600',
        cancelled: 'text-red-600',
        finished: 'text-green-600'
      }

      return(
        <div className={`${bg_colors[row.original.status]} ${text_colors[row.original.status]} max-w-[120px] px-4 py-1 rounded-2xl text-center`}>
          <span className="capitalize">{row.original.status}</span>
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
