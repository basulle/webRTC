import { styled } from 'styled-components';

export const Container = styled.div`
  position: relative;
  padding: 10px;
  display: flex;
  flex: 1;
  flex-direction: column;
`;

export const VideoContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  gap: 10px;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

export const VideoWrapper = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;

  &:first-child {
    transform: rotateY(180deg);
    -webkit-transform: rotateY(180deg);
  }
`;

export const Video = styled.video`
  width: 100%;
  border-radius: 10px;
  background: #8f8f8f;
`;

export const RoomId = styled.div`
  position: fixed;
  top: 15px;
  left: 15px;
  padding: 10px;
  background-color: orange;
  z-index: 1;
  border-radius: 10px;
`;
