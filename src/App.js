import React, { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import {
  Chat,
  Channel,
  Window,
  ChannelHeader,
  MessageList,
  MessageInput,
  Thread,
  LoadingIndicator,
  ChannelList,
} from "stream-chat-react";

import "stream-chat-react/dist/css/index.css";

const apiKey = process.env.REACT_APP_API_KEY;


  const user = 
  {
    id: "john",
    name: "John",
    image: "https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_256,w_256,f_auto,q_auto:eco,dpr_1/rqmbxuwmevgboyuazyct",
  }


const filters = { type: "messaging", members: { $in: [user.id] } };
const sort = { last_message_at: -1 };

function CustomChannelPreview(props) {
  const { channel, SetActiveChannel } = props;
  const { messages } = channel.state;
  const lastMessage = messages[messages.length - 1];

  return (
    <button
      onClick={() => SetActiveChannel(channel)}
      style={{ margin: "12px" }}
    >
      <div>{channel.data.name || "Unnamed Channel"}</div>
      <div style={{ fontSize: "20px" }}>{lastMessage}</div>
    </button>
  );
}

export default function Project() {
  const [client, setClient] = useState(null);

  useEffect(() => {
    async function init() {
      const chatClient = StreamChat.getInstance(apiKey);

      await chatClient.connectUser(user, chatClient.devToken(user.id));

      const channel = chatClient.channel("messaging", "community-talk", 
      {
        image: "https://th.bing.com/th/id/OIP.eDvXzty9BCWSgcOPZZMB8gHaHa?pid=ImgDet&rs=1",
        name: "DevOps Roadmap",
        members: [user.id],
      });

      await channel.watch();

      setClient(chatClient);
    }
    init();
    if (client) return () => client.disconnectUser();
  }, []);

  if (!client) return <LoadingIndicator/>;

  return (
    <Chat client={client} theme="messaging dark">
      <ChannelList
        filters={filters}
        sort={sort}
      />
        <Channel>
        <Window>
          <ChannelHeader />
          <MessageList />
          <MessageInput />
        </Window>
        <Thread />
      </Channel>
    </Chat>
  );
}
