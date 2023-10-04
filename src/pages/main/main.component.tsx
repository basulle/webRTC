import { AppRoutes } from '@constants/routes.constants';
import { useService } from '@hooks/use-service/use-service.hook';
import { MediaDevicesService } from '@services/media-devices/media-devices.service';
import { PeerConnectionService } from '@services/peer-connection/peer-connection.service';

import { ChangeEvent, useState, FC } from 'react';
import { generatePath, useNavigate } from 'react-router';

import * as Styled from './main.styles';

const Main: FC = () => {
  const [inputValue, setInputValue] = useState('');
  const { localStream$ } = useService(PeerConnectionService);
  const { getUserMedia } = useService(MediaDevicesService);

  const navigate = useNavigate();

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.currentTarget.value);
  };

  const handleJoin = () => {
    getUserMedia().subscribe((stream) => {
      localStream$.next(stream);
      navigate(generatePath(AppRoutes.Room, { id: inputValue }));
    });
  };

  return (
    <Styled.Container>
      <Styled.Label>Room ID:</Styled.Label>
      <Styled.Input value={inputValue} onChange={handleInputChange} />
      <button onClick={handleJoin}>Join</button>
    </Styled.Container>
  );
};

export default Main;
