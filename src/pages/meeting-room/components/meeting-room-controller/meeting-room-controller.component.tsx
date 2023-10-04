import { AppRoutes } from '@constants/routes.constants';
import { useService } from '@hooks/use-service/use-service.hook';
import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import * as Styled from './meeting-room-controller.styles';
import MicNoneOutlinedIcon from '@mui/icons-material/MicNoneOutlined';
import MicOffOutlinedIcon from '@mui/icons-material/MicOffOutlined';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import VideocamOffOutlinedIcon from '@mui/icons-material/VideocamOffOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { IconButton } from '@mui/material';
import { PeerConnectionService } from '@services/peer-connection/peer-connection.service';

const MeetingRoomController: FC = () => {
  const { localStream$ } = useService(PeerConnectionService);
  const [microphone, setMicrophone] = useState(true);
  const [camera, setCamera] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const subscription = localStream$.subscribe((stream) => {
      const microphone = stream.getTracks().find((track) => track.kind === 'audio');
      const camera = stream.getTracks().find((track) => track.kind === 'video');
      setMicrophone(microphone.enabled);
      setCamera(camera.enabled);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [localStream$, setMicrophone]);

  const handleLeaveChannel = () => {
    navigate(AppRoutes.Main);
  };

  const handleToggleMicrophone = () => {
    localStream$.subscribe((stream) => {
      const microphone = stream.getTracks().find((track) => track.kind === 'audio');
      if (microphone.enabled) {
        microphone.enabled = false;
        setMicrophone(false);
      } else {
        microphone.enabled = true;
        setMicrophone(true);
      }
    });
  };

  const handleToggleCamera = () => {
    localStream$.subscribe((stream) => {
      const camera = stream.getTracks().find((track) => track.kind === 'video');
      if (camera.enabled) {
        camera.enabled = false;
        setCamera(false);
      } else {
        camera.enabled = true;
        setCamera(true);
      }
    });
  };

  return (
    <Styled.Container>
      <IconButton aria-label="Microphone" onClick={handleToggleMicrophone}>
        {microphone ? (
          <MicNoneOutlinedIcon fontSize="inherit" color="primary" />
        ) : (
          <MicOffOutlinedIcon fontSize="inherit" color="primary" />
        )}
      </IconButton>
      <IconButton aria-label="Camera" onClick={handleToggleCamera}>
        {camera ? <VideocamOutlinedIcon color="primary" /> : <VideocamOffOutlinedIcon color="primary" />}
      </IconButton>
      <IconButton aria-label="Leave" onClick={handleLeaveChannel}>
        <LogoutOutlinedIcon color="primary" />
      </IconButton>
    </Styled.Container>
  );
};

export default MeetingRoomController;
