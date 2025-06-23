import { useEffect, useState } from "react";
import { useParams } from "react-router"
import useAuthUser from "../hooks/useAuthUser.js";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api.js";

import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from 'stream-chat-react';
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";
import PageLoader from "../components/PageLoader.jsx";
import CallButton from "../components/CallButton.jsx";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const ChatPage = () => {
  const {id: recipientUserId} = useParams();

  const [chatClient, setChatClient] = useState(null);
  const [chatChannel, setChatChannel] = useState(null);
  const [loading, setLoading] = useState(true); // try to connect to stream as soon as this page is visited
  
  const {authUser, isLoading, error} = useAuthUser();

  const {data: tokenData} = useQuery({
    queryKey: ['streamToken'],
    queryFn: getStreamToken,
    enabled: !!authUser    // JS trick - to convert authUser to boolean, don't run queryFn until authUser is fetched/available
  })

  useEffect(() => {
    const initChat = async() => {
      if(!tokenData?.token || !authUser) {
        console.log(tokenData);
        return;
      }
      try {
        console.log('Init');
        const client = StreamChat.getInstance(STREAM_API_KEY);
        await client.connectUser({
          id: authUser._id,
          name: authUser.fullName,
          image: authUser.profilePic
        }, tokenData.token);

        // sorting so same channelId is created regardless of who initiates the channel
        const channelId = [authUser._id, recipientUserId].sort().join('-');

        const currentChannel = client.channel('messaging', channelId, {
          members: [authUser._id, recipientUserId]
        });

        await currentChannel.watch(); // to initiate real time updates

        setChatClient(client);
        setChatChannel(currentChannel);
      } catch(error) {
        console.log('Error initializing chat', error);
        toast.error('Error initializing chat');
      } finally {
        setLoading(false);
      }
    }

    initChat();
  }, [tokenData, authUser, recipientUserId])

  const handleVideoCall = () => {
    if (chatChannel) {
      const callUrl = `${window.location.origin}/videocall/${chatChannel.id}`;

      chatChannel.sendMessage({
        text: `I've started a video call. Join me here: ${callUrl}`,
      });

      toast.success("Video call link sent successfully!");
    }
  };

  if(loading || !chatClient || !chatChannel) return <PageLoader />

  return (
    <div className="h-[93vh]">
      <Chat client={chatClient}>
        <Channel channel={chatChannel}>
          <div className="w-full relative">
            <CallButton handleVideoCall={handleVideoCall} />
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput focus />
            </Window>
          </div>
          <Thread />
        </Channel>
      </Chat>
    </div>
  )
}

export default ChatPage