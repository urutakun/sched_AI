import type { Department } from "./Department";

export interface Event {
  id: string;
  title: string;
  description: string;
  start_datetime: string;
  end_datetime: string;
  type: 'school' | 'department';
  dept_id: string;
  instructor_id: string;
  location: string;
  is_active: boolean;
  department: Department;
}
