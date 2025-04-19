'use client'
import React from 'react'
import ChatBox from './chatbox'
import { useChatProvider } from '@/providers/chat-provider';

export default function ChatBoxWrapper() {
  const { isChatOpen } = useChatProvider();
  return (
    <>
    { isChatOpen && <ChatBox /> }
    </>
  )
}
