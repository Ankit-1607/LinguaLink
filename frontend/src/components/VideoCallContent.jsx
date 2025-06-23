import { CallControls, CallingState, SpeakerLayout, StreamTheme, useCallStateHooks } from '@stream-io/video-react-sdk';
import { useNavigate } from 'react-router';

const VideoCallContent = ({chatID}) => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  const navigate = useNavigate();

  if (callingState === CallingState.LEFT) return navigate("/"); // if user leaves the call take them to home screen

  return (
    <StreamTheme>
      <SpeakerLayout />
      <CallControls />
    </StreamTheme>
  );
}

export default VideoCallContent