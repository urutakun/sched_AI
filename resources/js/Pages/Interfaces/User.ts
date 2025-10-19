export interface User {
  id: string;
  first_name: string;
  last_name: string;
  year?: number;
  section?: string;
  department?: string; 
  role: string;
  email: string;
  password: string;
}
