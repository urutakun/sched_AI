import React, { useState } from 'react'
import Layout from "@/Layouts/Layout"
import { DataTable } from '../Components/DataTable';
import type { Instructor as InstructorType} from '../Interfaces/Instructor';
import { InstructorColumns } from '../Components/InstructorColumns';

const instructorsData: InstructorType[] = [
  {
    instr_id: "I-001",
    dept_id: "D-001",
    first_name: "Maria",
    last_name: "Santos",
    instr_position: "Associate Professor",
    email: "maria.santos@university.edu",
    password: "hashed_password_1",
  },
  {
    instr_id: "I-002",
    dept_id: "D-002",
    first_name: "John",
    last_name: "Reyes",
    instr_position: "Assistant Professor",
    email: "john.reyes@university.edu",
    password: "hashed_password_2",
  },
  {
    instr_id: "I-003",
    dept_id: "D-003",
    first_name: "Liza",
    last_name: "Cruz",
    instr_position: "Lecturer",
    email: "liza.cruz@university.edu",
    password: "hashed_password_3",
  },
  {
    instr_id: "I-004",
    dept_id: "D-001",
    first_name: "Carlos",
    last_name: "Dela Cruz",
    instr_position: "Professor",
    email: "carlos.delacruz@university.edu",
    password: "hashed_password_4",
  },
  {
    instr_id: "I-005",
    dept_id: "D-002",
    first_name: "Angela",
    last_name: "Garcia",
    instr_position: "Instructor I",
    email: "angela.garcia@university.edu",
    password: "hashed_password_5",
  },
]



const Instructor = () => {
  const [instructors, setInstructors] = useState<InstructorType[]>(instructorsData);
  return (
    <div className='w-full h-full bg-white shadow-sm rounded-2xl p-4'>
      <DataTable columns={InstructorColumns} data={instructorsData} filterLabel={"last name"} filterColumn={"last_name"} createUrl={'/admin/instructors/create'}/>
    </div>
  )
}

Instructor.layout = (page: React.ReactNode) => <Layout title={'Instructors'}>{page}</Layout>
export default Instructor
