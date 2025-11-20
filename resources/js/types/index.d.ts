import { Program } from "@/Pages/Interfaces/Program";
import { Student } from "@/Pages/Interfaces/Student";

export interface User {
    id: number;
    first_name: string;
    last_name: string;
    instructor_id: string;
    instructor: {
      dept_id: string;
      instructor_type: 'part-time' | 'full-time';
    }
    student: {
      section: string;
      program: Program;
      year: string;
    }
    role: string;
    avatar?: string;
    email: string;
    email_verified_at?: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
};
