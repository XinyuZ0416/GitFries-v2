'use client';
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuthProvider } from "./auth-provider";
import { Timestamp, arrayUnion, deleteField, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db, storage } from "@/app/firebase";
import { getDownloadURL, ref } from "firebase/storage";

interface ChatContextProps {
  isChatOpen: boolean,
  chatTargetUid: string | null,
  setChatTargetUid: React.Dispatch<React.SetStateAction<string | null>>,
  openChat: (targetUid?: string, chatTargetUsername?: string, targetPicUrl?: string) => void,
  closeChat: () => void,
  chatTargetUsername: string | null,
  setChatTargetUsername: React.Dispatch<React.SetStateAction<string | null>>,
  chatTargetPicUrl: string,
  setChatTargetPicUrl: React.Dispatch<React.SetStateAction<string>>,
  displayEmptyChat: boolean,
  setDisplayEmptyChat: React.Dispatch<React.SetStateAction<boolean>>,
  chats?: ChatType,
  readChats: ChatType | undefined,
  setReadChats: React.Dispatch<React.SetStateAction<ChatType | undefined>>,
  chatUsers: ChatUserType[],
  isViewingChatLogsFromProfile: boolean, 
  setIsViewingChatLogsFromProfile: React.Dispatch<React.SetStateAction<boolean>>,
}

interface ChatMessage {
  content: string,
  role: string,
  timestamp: Timestamp,
}

type ChatType = {
  [targetUid: string]: ChatMessage[];
}

type ChatUserType = {
  id: string, 
  username: string, 
  avatar: string,
  lastMessageTime: Date,
  unreadCount?: number,
}

const ChatContext = createContext<ChatContextProps | null>(null);

export const ChatProvider = ({children}:{children: React.ReactNode}) => {
  const [ isChatOpen, setIsChatOpen ] = useState<boolean>(false);
  const [ chatTargetUid, setChatTargetUid ] = useState<string | null >(null);
  const [ chatTargetUsername, setChatTargetUsername ] = useState<string | null >(null);
  const [ chatTargetPicUrl, setChatTargetPicUrl ] = useState<string>('/potato.png');
  const [ displayEmptyChat, setDisplayEmptyChat ] = useState<boolean>(false);
  const [ isViewingChatLogsFromProfile, setIsViewingChatLogsFromProfile ] = useState<boolean>(false);
  const [ chats, setChats ] = useState<ChatType>();
  const [ readChats, setReadChats ] = useState<ChatType | undefined>();
  const [ chatUsers, setChatUsers ] = useState<ChatUserType[]>([]);
  const { uid } = useAuthProvider();

  const openChat = (targetUid?: string, targetUsername?: string, targetPicUrl?: string) => {
    if (targetUid && targetUsername && targetPicUrl) {
      setChatTargetUid(targetUid);
      setChatTargetUsername(targetUsername);
      setChatTargetPicUrl(targetPicUrl);
      setDisplayEmptyChat(false);
      setIsViewingChatLogsFromProfile(true);
    } else {
      setChatTargetUid(null);
      setChatTargetUsername(null);
      setChatTargetPicUrl('/potato.png');
      setDisplayEmptyChat(true);
      setIsViewingChatLogsFromProfile(false);
    }
    setIsChatOpen(true);
  }

  const closeChat = () => {
    setChatTargetUid(null);
    setChatTargetUsername(null);
    setChatTargetPicUrl('/potato.png');
    setDisplayEmptyChat(false);
    setIsChatOpen(false);
    setIsViewingChatLogsFromProfile(false);
  }

  useEffect(() => {
    if (!uid) return;

    const userDocRef = doc(db, "users", uid);
    
    const unsubscribe = onSnapshot(userDocRef, async(docSnap) => {
      const userData = docSnap.data();
      if (!userData) return;
      
      setChats(userData.chats);
      setReadChats(userData.readChats);

      const readChatsUids = Object.keys(userData.readChats || {});
      const unreadChatsUids = Object.keys(userData.chats || {});
      const allChatsUids = Array.from(new Set([...unreadChatsUids, ...readChatsUids]));

      const currentUserDocSnap = await getDoc(doc(db, "users", uid));
      const currentUserData = currentUserDocSnap.data();

      const entries = await Promise.all(
        allChatsUids.map(async(targetUid) => {
          // Get target user data
          const targetUserDocSnap = await getDoc(doc(db, "users", targetUid));
          const targetUserData = targetUserDocSnap.data();
          const targetUserUrl = await getDownloadURL(ref(storage, `user-img/${targetUid}`)).catch(() => '/potato.png');

          // Get the current user last message timestamp
          const messages = currentUserData?.chats?.[targetUid] || currentUserData?.readChats?.[targetUid];
          const lastMessage = messages?.[messages.length - 1];
          const timeStamp = lastMessage?.timestamp?.toDate?.() || new Date(0);
          const unreadCount = (currentUserData?.chats?.[targetUid] || []).length;
          
          return {
            id: targetUid,
            username: targetUserData?.username || "Unknown",
            avatar: targetUserUrl || "/potato.png",
            lastMessageTime: timeStamp,
            unreadCount: unreadCount,
          };
        })
      );
      entries.sort((a, b) => b.lastMessageTime - a.lastMessageTime);
      setChatUsers(entries);
    });

    return () => unsubscribe();
  }, [uid]);

  // Move unread messages to readChats
  useEffect(() => {
    const moveChats = async () => {
      if (!uid || !chatTargetUid || !isChatOpen || !chats) return;

      const unreadMessages = chats[chatTargetUid];
      if (!unreadMessages || unreadMessages.length === 0) return;

      for (let chat of unreadMessages) {
        await updateDoc(doc(db, "users", uid), {
          [`readChats.${chatTargetUid}`]: arrayUnion(chat),
        });
      }

      await updateDoc(doc(db, "users", uid), {
        [`chats.${chatTargetUid}`]: deleteField(),
      });
    };

    moveChats();
  }, [chats, chatTargetUid, isChatOpen]);

  return(
    <ChatContext.Provider 
      value={{ 
        isChatOpen, 
        chatTargetUid, setChatTargetUid,
        openChat, closeChat,
        chatTargetUsername, setChatTargetUsername,
        chatTargetPicUrl, setChatTargetPicUrl,
        displayEmptyChat, setDisplayEmptyChat,
        chats,
        readChats, setReadChats,
        chatUsers,
        isViewingChatLogsFromProfile, setIsViewingChatLogsFromProfile
      }}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChatProvider = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
