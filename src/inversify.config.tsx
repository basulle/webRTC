import { MediaDevicesService } from '@services/media-devices/media-devices.service';
import { IMediaDevices } from '@services/media-devices/media-devices.types';
import { PeerConnectionService } from '@services/peer-connection/peer-connection.service';
import { IPeerConnectionService } from '@services/peer-connection/peer-connection.types';
import { Container } from 'inversify';

import { CallsService } from './services/calls/calls.service';
import { ICallsService } from './services/calls/calls.types';
import { TYPES } from './services/types';

export const inversifyAppContainer = new Container({ defaultScope: 'Singleton' });

inversifyAppContainer.bind<ICallsService>(TYPES.CallsService).to(CallsService);
inversifyAppContainer.bind<IPeerConnectionService>(TYPES.PeerConnectionService).to(PeerConnectionService);
inversifyAppContainer.bind<IMediaDevices>(TYPES.MediaDevicesService).to(MediaDevicesService);
