import { useParams } from "react-router"
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api.js";

import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
} from "@stream-io/video-react-sdk";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import toast from "react-hot-toast";
import PageLoader from "../components/PageLoader.jsx";
import VideoCallContent from "../components/VideoCallContent.jsx";
import { useEffect, useState } from "react";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;
const VideoCallPage = () => {

  const {id: videoChannelID} = useParams();
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);

  const {authUser, isLoading} = useAuthUser();

  const {data: tokenData} = useQuery({
    queryKey: ['streamToken'],
    queryFn: getStreamToken,
    enabled: !!authUser
  });

  useEffect(() => {
    const initVideoCall = async () => {
      if(!tokenData?.token || !authUser || !videoChannelID) return;

      try {
        console.log("init video");
        const user = {
          id: authUser._id,
          name: authUser.fullName,
          image: authUser.profilePic
        }
        const videoClient = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user,
          token: tokenData.token
        })

        const callInstance = videoClient.call('default', videoChannelID);
        await callInstance.join({create:true}); // create:true -> call will be created if doesn't exist

        console.log('Joined call successfully');

        setClient(videoClient);
        setCall(callInstance);
      } catch(error) {
        console.log('Error joining call', error);
        toast.error("Couldn't join call. Please try again");
      } finally {
        setIsConnecting(false);
      }
    }
    initVideoCall();
  }, [tokenData, authUser, videoChannelID]);

  if(isLoading || isConnecting) return <PageLoader />
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="relative">
        {client && call ? (
          <StreamVideo client={client}>
            <StreamCall call={call}>
              <VideoCallContent />
            </StreamCall>
          </StreamVideo>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p>Could not initialize call. Please refresh or try again later.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default VideoCallPage