'use client'
import React, { createContext, useContext, useState } from "react";

// auth context
interface ChatContextProps {
  isChatOpen: boolean,
  chatTargetUid: string | null,
  openChat: (targetUid?: string) => void,
  closeChat: () => void
}

const ChatContext = createContext<ChatContextProps | null>(null);

export const ChatProvider = ({children}:{children: React.ReactNode}) => {
  const [ isChatOpen, setIsChatOpen ] = useState<boolean>(false);
  const [ chatTargetUid, setChatTargetUid ] = useState<string | null >(null);

  const openChat = (targetUid?: string) => {
    if (targetUid) {
      setChatTargetUid(targetUid);
    }
    
    setIsChatOpen(true);
  }

  const closeChat = () => {
    setChatTargetUid(null);
    setIsChatOpen(false);
  }

  return(
    <ChatContext.Provider 
      value={{ isChatOpen, chatTargetUid, openChat, closeChat }}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChatProvider = () => {
  const context = useContext(ChatContext);
  if(!context) {
    throw new Error('useChat must be used within an ChatProvider');
  }
  return context;
}
