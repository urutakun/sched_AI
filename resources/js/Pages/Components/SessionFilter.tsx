import React, { useState } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Department } from '../Interfaces/Department';
import { Program } from '../Interfaces/Program';

interface SessionFilterProps {
  departments?: Department[];
  onDepartmentChange?: (deptID: string) => void;
  programs?: Program[];
  onProgramChange: (programID: string) => void;
}

const SessionFilter = ({
  departments,
  onDepartmentChange,
  programs,
  onProgramChange
}: SessionFilterProps) => {
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);

  const handleReset = () => {
    setSelectedDept(null);
    setSelectedProgram(null);
    if(onDepartmentChange) onDepartmentChange('');
    if(onProgramChange) onProgramChange('');
  }

  return (
    <div className='lg:flex items-center space-y-2 lg:space-y-0 lg:space-x-3'>
      {departments && (
        <Select
          value={selectedDept ?? ''}
          onValueChange={(val) => {
            setSelectedDept(val);
            if(onDepartmentChange) onDepartmentChange(val);
          }}
          >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Department" />
          </SelectTrigger>
          <SelectContent>
            {departments?.map((dept) => (
              <SelectItem key={dept.id} value={dept.id}>
                {dept.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      {programs && (
       <Select
        value={selectedProgram ?? ''}
        onValueChange={(val) => {
          setSelectedProgram(val);
          if(onProgramChange) onProgramChange(val);
        }}
       >
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
      )}
      {(selectedDept || selectedProgram) && (
        <Button variant="outline" size="icon" className='hover:bg-slate-50' onClick={handleReset}>
          <RefreshCw />
        </Button>
      )}
    </div>
  )
}

export default SessionFilter
