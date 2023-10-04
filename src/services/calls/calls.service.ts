import { ICallsService } from './calls.types';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import Agora, { RtmChannel, RtmMessage } from 'agora-rtm-sdk';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { IPeerConnectionService } from '@services/peer-connection/peer-connection.types';
import { MessageFromPeer } from '@constants/message-from-peer.constants';

const uid = String(Date.now());

@injectable()
export class CallsService implements ICallsService {
  public static type = TYPES.CallsService;
  private client = Agora.createInstance(import.meta.env.VITE_AGORA_APP_ID);
  private channel$: BehaviorSubject<RtmChannel> = new BehaviorSubject<RtmChannel>(null);
  private peerConnection: IPeerConnectionService;

  public constructor(@inject(TYPES.PeerConnectionService) peerConnection: IPeerConnectionService) {
    this.login = this.login.bind(this);
    this.joinChannel = this.joinChannel.bind(this);
    this.leaveChannel = this.leaveChannel.bind(this);
    this.peerConnection = peerConnection;

    peerConnection.onIceCandidate$.subscribe(({ candidate, memberId }) =>
      this.client.sendMessageToPeer(
        { text: JSON.stringify({ type: MessageFromPeer.Candidate, candidate: candidate }) },
        memberId,
      ),
    );

    this.client.on('MessageFromPeer', (message: RtmMessage, memberId: string) => {
      const text = JSON.parse(message.text);

      switch (text.type) {
        case MessageFromPeer.Offer:
          peerConnection.createAnswer(memberId, text.offer).subscribe((answer) => {
            this.client.sendMessageToPeer(
              { text: JSON.stringify({ type: MessageFromPeer.Answer, answer: answer }) },
              memberId,
            );
          });
          break;

        case MessageFromPeer.Answer:
          peerConnection.addAnswer(text.answer);
          break;

        case MessageFromPeer.Candidate:
          if (peerConnection) {
            peerConnection.addIceCandidate(text.candidate);
          }
          break;

        default:
          throw new Error('Not defined message from peer type');
      }
    });

    this.channel$.subscribe((channel) => {
      if (channel) {
        channel.on('MemberJoined', (memberId: string) => {
          peerConnection.createOffer(memberId).subscribe((offer) => {
            this.client.sendMessageToPeer(
              { text: JSON.stringify({ type: MessageFromPeer.Offer, offer: offer }) },
              memberId,
            );
          });
        });
      }
    });
  }

  public login(): Observable<void> {
    return from(this.client.login({ uid, token: undefined }));
  }

  public logout(): void {}

  public joinChannel(id: string): Observable<void> {
    const channel = this.client.createChannel(id);
    this.channel$.next(channel);

    return from(channel.join());
  }

  public leaveChannel(): void {
    this.channel$.getValue().leave();
    this.channel$.getValue().removeAllListeners();
    this.channel$.next(null);
    this.peerConnection.disconnect();
  }
}
