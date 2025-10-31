import { User } from '../Interfaces/User';
import { Department } from './Department';

export interface Instructor {
  id: string;
  dept_id: string;
  first_name: string;
  last_name: string;
  max_load: number; 
  email: string;
  password: string;
  user: User;
  department: Department;
}
