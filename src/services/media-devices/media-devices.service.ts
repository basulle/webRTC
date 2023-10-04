import { TYPES } from '@services/types';
import { injectable } from 'inversify';
import { from, Observable } from 'rxjs';
import { IMediaDevicesService } from './media-devices.types';

@injectable()
export class MediaDevicesService implements IMediaDevicesService {
  public static type = TYPES.MediaDevicesService;
  public constructor() {
    this.getUserMedia = this.getUserMedia.bind(this);
  }

  public getUserMedia(): Observable<MediaStream> {
    return from(navigator.mediaDevices.getUserMedia({ video: true, audio: true }));
  }
}
