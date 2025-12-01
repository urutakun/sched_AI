import { Session } from "./Session";

export interface CancellationRequest {
  id: string;
  session_id: string;
  type: 'personal' | 'medical' | 'weather' | 'event' | 'others';
  reason: string;
  attachment: string;
  status: 'pending' | 'approved' | 'denied';
  schedule_session: Session;
}
