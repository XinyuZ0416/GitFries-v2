import { Timestamp } from "firebase/firestore";

export interface ChatBubbleProps {
  url: string, 
  username: string, 
  time: Timestamp, 
  content: string
}