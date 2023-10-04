import { useService } from '@hooks/use-service/use-service.hook';

import { CallsService } from '@services/calls/calls.service';
import { PeerConnectionService } from '@services/peer-connection/peer-connection.service';
import { FC, useEffect, useRef } from 'react';
import { useParams } from 'react-router';
import { MeetingRoomController } from './components/meeting-room-controller';

import * as Styled from './meeting-room.styles';

const MeetingRoom: FC = () => {
  const { joinChannel, leaveChannel } = useService(CallsService);
  const { localStream$, remoteStream$ } = useService(PeerConnectionService);
  const localStreamRef = useRef<HTMLVideoElement>();
  const remoteStreamRef = useRef<HTMLVideoElement>();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const subscriptions = [
      joinChannel(id).subscribe(),
      localStream$.subscribe((stream) => {
        localStreamRef.current.srcObject = stream;
      }),
      remoteStream$.subscribe((stream) => {
        remoteStreamRef.current.srcObject = stream;
      }),
    ];

    return () => {
      subscriptions.forEach((subscription) => subscription.unsubscribe());
      leaveChannel();
    };
  }, [joinChannel, id, localStream$, remoteStream$, leaveChannel]);

  return (
    <Styled.Container>
      <Styled.RoomId>Room ID: {id}</Styled.RoomId>
      <Styled.VideoContainer>
        <Styled.VideoWrapper>
          <Styled.Video ref={localStreamRef} autoPlay playsInline muted />
        </Styled.VideoWrapper>
        <Styled.VideoWrapper>
          <Styled.Video ref={remoteStreamRef} autoPlay playsInline />
        </Styled.VideoWrapper>
      </Styled.VideoContainer>
      <MeetingRoomController />
    </Styled.Container>
  );
};

export default MeetingRoom;
