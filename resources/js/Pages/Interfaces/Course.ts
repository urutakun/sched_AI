import { AcademicYear } from "./AcademicYear";
import { Department } from "./Department";
import { Trimester } from "./Trimester";
export interface Course {
  id: string;
  academic_years_id: string;
  trimester_id: string;
  dept_id: string;
  code: string;
  name: string;
  units: number;
  has_lab: boolean;
  is_assigned: boolean;
  academic_year: AcademicYear;
  trimester: Trimester;
  department: Department;
}
