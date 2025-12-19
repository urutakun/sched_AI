import { User } from "./User";
import { Department } from "./Department";

export interface Dean {
  id: string;
  dept_id: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  user: User;
  department: Department;
}
