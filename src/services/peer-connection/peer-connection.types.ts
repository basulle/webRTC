import { BehaviorSubject, Observable, Subject } from 'rxjs';

export interface IPeerConnectionService {
  localStream$: BehaviorSubject<MediaStream>;
  remoteStream$: BehaviorSubject<MediaStream>;
  onIceCandidate$: Subject<{
    candidate: RTCIceCandidate;
    memberId: string;
  }>;
  addIceCandidate(candidate: RTCIceCandidateInit): void;
  createOffer(memberId: string): Observable<RTCSessionDescriptionInit>;
  createAnswer(memberId: string, offer: RTCSessionDescriptionInit): Observable<RTCSessionDescriptionInit>;
  addAnswer(answer: RTCSessionDescriptionInit): void;
  disconnect(): void;
}
