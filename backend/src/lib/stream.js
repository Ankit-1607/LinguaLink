import {StreamChat} from 'stream-chat'
import 'dotenv/config'

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if(!apiKey || !apiSecret)
  console.log("Stream API key or secret is missing");

const streamClient = StreamChat.getInstance(apiKey, apiSecret);

export const upsertStreamUser = async (userData) => {
  try {
    await streamClient.upsertUser(userData); // upsert = create/update
    return userData;
  } catch(error) {
    console.error("Error upserting stream user", error);
  }
}

export const generateStreamToken = (userID) => {
  try {
    const userIdString = userID.toString();
    return streamClient.createToken(userIdString);
  } catch(error) {
    console.error("Error generating stream token: ", error);
  }
}