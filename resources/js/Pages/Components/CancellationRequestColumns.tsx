"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { CancellationRequest } from "../Interfaces/CancellationRequest";

// export const CancellationRequestColumns = (
//     handleShow: (id: string) => void,
//     handleEdit: (id: string) => void,
//     setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
//     setDeletingId: React.Dispatch<React.SetStateAction<string>>,
//     role?: string,
// ): ColumnDef<CancellationRequest>[] => [
//     {
//         id: "date",
//         accessorFn: (row) => row.created_at,
//         header: ({ column }) => {
//             return (
//                 <div
//                     className="font-bold uppercase flex cursor-pointer hover:text-black ctransition"
//                     onClick={() =>
//                         column.toggleSorting(column.getIsSorted() === "asc")
//                     }
//                 >
//                     Request Date
//                     <ArrowUpDown className="ml-2 h-4 w-4" />
//                 </div>
//             );
//         },
//         cell: ({ row }) => {
//           const date = new Date(row.original.created_at);
//           const formattedDate = date.toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'});
//           return formattedDate;
//         }
//     },
//     {
//         id: "department",
//         accessorFn: (row) => row.schedule_session.schedule.department.name,
//         header: ({ column }) => {
//             return (
//                 <div
//                     className="font-bold uppercase flex cursor-pointer hover:text-black ctransition"
//                     onClick={() =>
//                         column.toggleSorting(column.getIsSorted() === "asc")
//                     }
//                 >
//                     Department
//                     <ArrowUpDown className="ml-2 h-4 w-4" />
//                 </div>
//             );
//         },
//     },
//     {
//         id: "program",
//         accessorFn: (row) => row.schedule_session.schedule.program.name,
//         header: ({ column }) => {
//             return (
//                 <div
//                     className="font-bold uppercase flex cursor-pointer hover:text-black ctransition"
//                     onClick={() =>
//                         column.toggleSorting(column.getIsSorted() === "asc")
//                     }
//                 >
//                     Program
//                     <ArrowUpDown className="ml-2 h-4 w-4" />
//                 </div>
//             );
//         },
//     },
//     {
//         id: "instructor",
//         accessorFn: (row) => {
//           const instructor = row.schedule_session.schedule.course_assignment.instructor.user;
//           const fullName = instructor.first_name + ' ' + instructor.last_name;
//           return fullName;
//         },
//         header: ({ column }) => {
//             return (
//                 <div
//                     className="font-bold uppercase flex cursor-pointer hover:text-black ctransition"
//                     onClick={() =>
//                         column.toggleSorting(column.getIsSorted() === "asc")
//                     }
//                 >
//                     Instructor
//                     <ArrowUpDown className="ml-2 h-4 w-4" />
//                 </div>
//             );
//         },
//     },
//     {
//         id: "course",
//         accessorFn: (row) => row.schedule_session.schedule.course_assignment.course.name,
//         header: ({ column }) => {
//             return (
//                 <div
//                     className="font-bold uppercase flex cursor-pointer hover:text-black ctransition"
//                     onClick={() =>
//                         column.toggleSorting(column.getIsSorted() === "asc")
//                     }
//                 >
//                     Course
//                     <ArrowUpDown className="ml-2 h-4 w-4" />
//                 </div>
//             );
//         },
//     },
//     {
//         id: "type",
//         accessorFn: (row) => row.type,
//         header: ({ column }) => {
//             return (
//                 <div
//                     className="font-bold uppercase flex cursor-pointer hover:text-black ctransition"
//                     onClick={() =>
//                         column.toggleSorting(column.getIsSorted() === "asc")
//                     }
//                 >
//                     Type
//                     <ArrowUpDown className="ml-2 h-4 w-4" />
//                 </div>
//             );
//         },
//         cell: ({ row }) => <span className="capitalize">{row.original.type}</span>
//     },
//     {
//         id: "status",
//         accessorFn: (row) => row.status,
//         header: ({ column }) => {
//             return (
//                 <div
//                     className="font-bold uppercase flex cursor-pointer hover:text-black ctransition"
//                     onClick={() =>
//                         column.toggleSorting(column.getIsSorted() === "asc")
//                     }
//                 >
//                     Status
//                     <ArrowUpDown className="ml-2 h-4 w-4" />
//                 </div>
//             );
//         },
//         cell: ({ row }) => {
//           const colors: Record<string,string> = {
//             pending: 'bg-gray-200 text-gray-600',
//             approved: 'bg-green-200 text-green-600',
//             denied: 'bg-red-200 text-red-600',
//           }

//           return(
//             <div className={`${colors[row.original.status]} max-w-[120px] px-4 py-1 rounded-2xl text-center`}>
//               <span className="capitalize">{row.original.status}</span>
//             </div>
//           )

//         }
//     },
//     {
//         id: "actions",
//         header: () => <div className="font-bold uppercase">Actions</div>,
//         cell: ({ row }) => {
//             const handleDelete = (id: string) => {
//               setDeletingId(id);
//               setIsOpen(true);
//             }
//             return (
//                 <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                         <Button
//                             variant="ghost"
//                             className="h-8 w-8 p-0 focus-visible:ring-0"
//                         >
//                             <span className="sr-only">Open menu</span>
//                             <MoreHorizontal className="h-4 w-4" />
//                         </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent align="end">
//                         <DropdownMenuLabel>Actions</DropdownMenuLabel>
//                         <DropdownMenuItem onClick={() => handleShow(row.original.id)}>View</DropdownMenuItem>
//                         {role !== 'instructor' && (
//                           <>
//                             <DropdownMenuItem onClick={() => handleEdit(row.original.id)}>Edit</DropdownMenuItem>
//                             <DropdownMenuItem onClick={() => handleDelete(row.original.id)}>Delete</DropdownMenuItem>
//                           </>
//                         )}
//                     </DropdownMenuContent>
//                 </DropdownMenu>
//             );
//         },
//     },
// ];

export const CancellationRequestColumns = (
  handleShow: (id: string) => void,
  handleEdit: (id: string) => void,
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setDeletingId: React.Dispatch<React.SetStateAction<string>>,
  role?: string,
): ColumnDef<CancellationRequest>[] => {

  const columns: ColumnDef<CancellationRequest>[] = [
    {
      id: "date",
      accessorFn: (row) => row.created_at,
      header: ({ column }) => (
        <div
          className="font-bold uppercase flex cursor-pointer hover:text-black"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Request Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      ),
      cell: ({ row }) => {
        const date = new Date(row.original.created_at);
        return date.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        });
      },
    },

    {
      id: "department",
      accessorFn: (row) => row.schedule_session.schedule.department.name,
      header: ({ column }) => (
        <div
          className="font-bold uppercase flex cursor-pointer hover:text-black"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Department
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      ),
    },

    {
      id: "program",
      accessorFn: (row) => row.schedule_session.schedule.program.name,
      header: ({ column }) => (
        <div
          className="font-bold uppercase flex cursor-pointer hover:text-black"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Program
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      ),
    },

    {
      id: "instructor",
      accessorFn: (row) => {
        const i = row.schedule_session.schedule.course_assignment.instructor.user;
        return `${i.first_name} ${i.last_name}`;
      },
      header: ({ column }) => (
        <div
          className="font-bold uppercase flex cursor-pointer hover:text-black"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Instructor
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      ),
    },

    {
      id: "course",
      accessorFn: (row) => row.schedule_session.schedule.course_assignment.course.name,
      header: ({ column }) => (
        <div
          className="font-bold uppercase flex cursor-pointer hover:text-black"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Course
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      ),
    },

    {
      id: "type",
      accessorFn: (row) => row.type,
      header: ({ column }) => (
        <div
          className="font-bold uppercase flex cursor-pointer hover:text-black"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Type
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      ),
      cell: ({ row }) => <span className="capitalize">{row.original.type}</span>,
    },

    {
      id: "status",
      accessorFn: (row) => row.status,
      header: ({ column }) => (
        <div
          className="font-bold uppercase flex cursor-pointer hover:text-black"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      ),
      cell: ({ row }) => {
        const colors: Record<string, string> = {
          pending: "bg-gray-200 text-gray-600",
          approved: "bg-green-200 text-green-600",
          denied: "bg-red-200 text-red-600",
        };
        return (
          <div className={`${colors[row.original.status]} max-w-[120px] px-4 py-1 rounded-2xl text-center`}>
            <span className="capitalize">{row.original.status}</span>
          </div>
        );
      },
    },

    {
      id: "actions",
      header: () => <div className="font-bold uppercase">Actions</div>,
      cell: ({ row }) => {
        const handleDelete = (id: string) => {
          setDeletingId(id);
          setIsOpen(true);
        };

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">

                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>

              <DropdownMenuItem onClick={() => handleShow(row.original.id)}>View</DropdownMenuItem>

              {role !== "instructor" && (
                <>
                  <DropdownMenuItem onClick={() => handleEdit(row.original.id)}>Edit</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDelete(row.original.id)}>Delete</DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  // 🔥 REMOVE columns based on role
  if (role === "instructor") {
    return columns.filter(
      (col) => !["instructor"].includes(col.id as string)
    );
  }

  return columns;
};
