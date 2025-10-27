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


export const EventColumns = (
    handleEdit: (id: string) => void,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    setDeletingId: React.Dispatch<React.SetStateAction<string>>
): ColumnDef<Event>[] => [
  {
    accessorKey: "id",
    header: () => <div className="font-bold uppercase">ID</div>,
  },
  {
    accessorKey: "room_name",
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
    },
  },
  {
    accessorKey: "room_type",
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
    cell: ({row}) => (<div className="capitalize">{row.original.type}</div>)
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
