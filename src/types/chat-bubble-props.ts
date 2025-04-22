import { Timestamp } from "firebase/firestore";

export interface ChatBubbleProps {
  url: string, 
  username: string, 
  time: Timestamp, 
  content: string
}

export interface AiChatBubbleProps {
  content: string;
}

export type QAType = {
  content: string,
  type: string
}