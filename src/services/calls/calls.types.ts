import { Observable } from 'rxjs';

export interface ICallsService {
  joinChannel(id: string): Observable<void>;
  leaveChannel(): void;
}
