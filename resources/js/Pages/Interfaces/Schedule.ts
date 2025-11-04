import type { AcademicYear } from "./AcademicYear";
import type { AssignCourse } from "./AssignCourse";
import type { Department } from "./Department";
import type { Program } from "./Program";
import type { Room } from "./Room";
import type { Trimester } from "./Trimester";

export interface Schedule {
  id: string;
  course_assignment_id: string;
  academic_year_id: string;
  trimester_id: string;
  department_id: string;
  program_id: string;
  section: string; 
  room_id: string;
  days: string[];
  start_time: string;
  end_time: string;
  status: 'active' | 'pending_cancel' | 'cancelled' | 'completed';
  academic_year: AcademicYear;
  trimester: Trimester;
  course_assignment: AssignCourse;
  department: Department;
  room: Room;
  program: Program;
}
