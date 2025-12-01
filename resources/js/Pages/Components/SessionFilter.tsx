import React, { useState, useEffect } from 'react'
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
  onDepartmentChange?: (deptID: string | null) => void;
  programs?: Program[];
  onProgramChange: (programID: string | null) => void;
}

const SessionFilter = ({
  departments,
  onDepartmentChange,
  programs,
  onProgramChange
}: SessionFilterProps) => {
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);

  // Reset program when department changes
  useEffect(() => {
    if (selectedDept && selectedProgram) {
      // Check if the selected program belongs to the selected department
      const dept = departments?.find(d => d.id === selectedDept);
      const programExists = dept?.programs.some(p => p.id === selectedProgram);
      
      if (!programExists) {
        setSelectedProgram(null);
        if (onProgramChange) onProgramChange(null);
      }
    }
  }, [selectedDept, selectedProgram, departments, onProgramChange]);

  const handleReset = () => {
    setSelectedDept(null);
    setSelectedProgram(null);
    if (onDepartmentChange) onDepartmentChange(null);
    if (onProgramChange) onProgramChange(null);
  }

  const handleDepartmentChange = (val: string) => {
    const value = val === "all" ? null : val;
    setSelectedDept(value);
    if (onDepartmentChange) onDepartmentChange(value);
  }

  const handleProgramChange = (val: string) => {
    const value = val === "all" ? null : val;
    setSelectedProgram(value);
    if (onProgramChange) onProgramChange(value);
  }

  // Helper function to get display value for Select
  const getDeptValue = () => selectedDept || "all";
  const getProgValue = () => selectedProgram || "all";

  return (
    <div className='lg:flex items-center space-y-2 lg:space-y-0 lg:space-x-3'>
      {departments && departments.length > 0 && (
        <Select
          value={getDeptValue()}
          onValueChange={handleDepartmentChange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {departments?.map((dept) => (
              <SelectItem key={dept.id} value={dept.id}>
                {dept.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      
      {programs && programs.length > 0 && (
        <Select
          value={getProgValue()}
          onValueChange={handleProgramChange}
          disabled={!selectedDept && selectedDept !== null}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue 
              placeholder={selectedDept !== null ? "Select Program" : "Select department first"}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Programs</SelectItem>
            {programs?.map((program) => (
              <SelectItem key={program.id} value={program.id}>
                {program.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      
      {(selectedDept || selectedProgram) && (
        <Button 
          variant="outline" 
          size="icon" 
          className='hover:bg-slate-50' 
          onClick={handleReset}
          title="Reset filters"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}

export default SessionFilter