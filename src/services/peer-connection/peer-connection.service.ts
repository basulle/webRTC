import { TYPES } from '@services/types';
import { injectable } from 'inversify';
import { BehaviorSubject, from, map, Observable, Subject, switchMap } from 'rxjs';
import { IPeerConnectionService } from './peer-connection.types';

const STUN_SERVERS = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
    },
  ],
};

@injectable()
export class PeerConnectionService implements IPeerConnectionService {
  public static type = TYPES.PeerConnectionService;
  private connection = new RTCPeerConnection(STUN_SERVERS);
  public localStream$: BehaviorSubject<MediaStream> = new BehaviorSubject(new MediaStream());
  public remoteStream$: BehaviorSubject<MediaStream> = new BehaviorSubject(new MediaStream());
  public onIceCandidate$: Subject<{ candidate: RTCIceCandidate; memberId: string }> = new Subject<{
    candidate: RTCIceCandidate;
    memberId: string;
  }>();
  public constructor() {
    this.addIceCandidate = this.addIceCandidate.bind(this);
    this.createOffer = this.createOffer.bind(this);
    this.createAnswer = this.createAnswer.bind(this);
    this.addAnswer = this.addAnswer.bind(this);
    this.disconnect = this.disconnect.bind(this);
    this.createPeerConnection = this.createPeerConnection.bind(this);
  }

  public createPeerConnection() {
    this.connection = new RTCPeerConnection(STUN_SERVERS);

    this.localStream$.subscribe((stream) => {
      stream.getTracks().forEach((track) => {
        this.connection.addTrack(track, stream);
      });
    });

    this.connection.ontrack = (event) => {
      this.remoteStream$.next(event.streams[0]);
      event.streams[0].getTracks().forEach((track) => {
        this.remoteStream$.getValue().addTrack(track);
      });
    };
  }

  public addIceCandidate(candidate: RTCIceCandidateInit) {
    this.connection.addIceCandidate(candidate);
  }

  public createOffer(memberId: string): Observable<RTCSessionDescriptionInit> {
    this.createPeerConnection();

    this.connection.onicecandidate = (event) => {
      if (event.candidate) {
        this.onIceCandidate$.next({ candidate: event.candidate, memberId });
      }
    };
    return from(this.connection.createOffer()).pipe(
      switchMap((offer) => from(this.connection.setLocalDescription(offer)).pipe(map(() => offer))),
    );
  }

  public createAnswer(memberId: string, offer: RTCSessionDescriptionInit): Observable<RTCSessionDescriptionInit> {
    this.createPeerConnection();
    this.connection.onicecandidate = (event) => {
      if (event.candidate) {
        this.onIceCandidate$.next({ candidate: event.candidate, memberId });
      }
    };

    return from(this.connection.setRemoteDescription(offer)).pipe(
      switchMap(() =>
        from(this.connection.createAnswer()).pipe(
          switchMap((answer) => from(this.connection.setLocalDescription(answer)).pipe(map(() => answer))),
        ),
      ),
    );
  }

  public addAnswer(answer: RTCSessionDescriptionInit): void {
    if (!this.connection.currentRemoteDescription) {
      this.connection.setRemoteDescription(answer);
    }
  }

  public disconnect() {
    this.connection.close();
    this.localStream$
      .getValue()
      .getTracks()
      .forEach((track) => track.stop());

    this.createPeerConnection();
  }
}
