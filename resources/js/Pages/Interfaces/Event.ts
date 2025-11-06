import type { Department } from "./Department";

export interface Event {
  id: string;
  title: string;
  description: string;
  start_datetime: string;
  end_datetime: string;
  type: 'school' | 'department';
  dept_id: string;
  location: string;
  status: 'upcoming' | 'ongoing' | 'finished' | 'cancelled';
  department: Department;
}
