import { Trimester } from "./Trimester";

export interface AcademicYear {
  id: string;
  year_start: number;
  year_end: number;
  status: 'active' | 'inactive';
  trimesters: Trimester[];
}
