import { Observable } from 'rxjs';

export interface IMediaDevicesService {
  getUserMedia(): Observable<MediaStream>;
}
