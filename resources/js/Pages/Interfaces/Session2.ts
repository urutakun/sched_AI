import { Schedule } from "./Schedule";

export interface Session {
  id: string;
  schedule_id: string;
  session_date: Date;
  status: string;
  schedule: Schedule;
}
