import { User } from './User'
import { Program } from './Program';

export interface Student {
  id: string;
  user_id: string;
  user: User;
  year: string;
  section: string;
  program_id: string;
  program: Program;
}
