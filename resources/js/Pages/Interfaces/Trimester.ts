import { AcademicYear } from "./AcademicYear";

export interface Trimester {
  id: string;
  academic_years_id: string;
  name: 'First Trimester' | 'Second Trimester' | 'Third Trimester';
  start_date: string;
  end_date: string;
  status: 'active' | 'inactive';
  academic_year: AcademicYear;
}
