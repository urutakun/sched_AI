import { Program } from "./Program";

export interface Department {
  id: string;
  code: string;
  name: string;
  head: string;
  programs: Program[];
}
