import React, { useState } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Department } from '../Interfaces/Department';
import { Program } from '../Interfaces/Program';

interface SessionFilterProps {
  departments: Department[];
  onDepartmentChange: (deptID: string) => void;
  programs: Program[];
  onProgramChange: (programID: string) => void;
}

const SessionFilter = ({
  departments,
  onDepartmentChange,
  programs,
  onProgramChange
}: SessionFilterProps) => {

  return (
    <div className='lg:flex items-center space-y-2 lg:space-y-0 lg:space-x-3'>
       <Select onValueChange={onDepartmentChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Department" />
        </SelectTrigger>
        <SelectContent>
          {departments.map((dept) => (
            <SelectItem key={dept.id} value={dept.id}>
              {dept.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
       <Select onValueChange={onProgramChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Program" />
        </SelectTrigger>
        <SelectContent>
          {programs?.map((program) => (
            <SelectItem key={program.id} value={program.id}>
              {program.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export default SessionFilter
