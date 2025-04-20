import React, { useEffect, useRef, useState } from 'react'
import { useChatProvider } from '@/providers/chat-provider'
import { Timestamp, arrayUnion, deleteField, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/app/firebase';
import { useAuthProvider } from '@/providers/auth-provider';
import ChatBubbleSender from './chat-bubble-sender';
import ChatBubbleReceiver from './chat-bubble-receiver';

export default function ChatWindow() {
  const { uid } = useAuthProvider();
  const { username, userPicUrl } = useAuthProvider();
  const chatEndRef = useRef<HTMLDivElement>(null);

  const {
    closeChat,
    chatTargetUid, setChatTargetUid,
    chatTargetUsername, setChatTargetUsername,
    chatTargetPicUrl, setChatTargetPicUrl,
    displayEmptyChat, setDisplayEmptyChat,
    chats,
    readChats, setReadChats,
    chatUsers,
    isViewingChatLogsFromProfile,
    setIsViewingChatLogsFromProfile
  } = useChatProvider();

  const [message, setMessage] = useState<string>('');
  const [chatBubbleList, setChatBubbleList] = useState<React.ReactElement[]>([]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'auto' });
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  }

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message || !chatTargetUid) return;

    try {
      const newMessage = {
        content: message,
        role: "sender",
        timestamp: Timestamp.fromDate(new Date()),
      };

      // Update chat sender readChats field
      await updateDoc(doc(db, "users", uid), {
        [`readChats.${chatTargetUid}`]: arrayUnion(newMessage),
      });

      // Update chat receiver unreadChats field
      await updateDoc(doc(db, "users", chatTargetUid), {
        [`chats.${uid}`]: arrayUnion({
          ...newMessage,
          role: "receiver"
        }),
      });

      setMessage('');
    } catch (err) {
      console.error(err);
    }
  }

  const handleDeleteChat = async (targetId: string) => {
    if (!confirm(`Delete chat? This action can't be undone.`)) return;

    try {
      await updateDoc(doc(db, "users", uid), {
        [`chats.${targetId}`]: deleteField(),
        [`readChats.${targetId}`]: deleteField()
      });
    } catch (err) {
      console.error(err);
    }
  }

  const handleSelectChat = async(targetId: string, targetUsername: string, targetUrl: string) => {
    setIsViewingChatLogsFromProfile(false);
    setChatTargetUid(targetId);
    setChatTargetUsername(targetUsername);
    setChatTargetPicUrl(targetUrl);
    setDisplayEmptyChat(false);

    // Move unread chats to read chats
    const moveChats = async() => {
      if (chats && chats[targetId]) {
        for (let chat of chats[targetId]) {
          await updateDoc(doc(db, "users", uid), { [`readChats.${targetId}`]: arrayUnion(chat)});
        }
        await updateDoc(doc(db, "users", uid), {[`chats.${targetId}`]: deleteField()});
      }
    }
    moveChats();
  }

  const renderChatBubbles = async () => {
    if (!chatTargetUid || !readChats) return;

    const currentChat = readChats[chatTargetUid];
    if (!currentChat) return;

    const bubbles = currentChat.map((chat) => (
      chat.role === "receiver" ? (
        <ChatBubbleReceiver
          key={`${chatTargetUid}-${chat.timestamp}`}
          url={chatTargetPicUrl}
          username={chatTargetUsername!}
          time={chat.timestamp}
          content={chat.content}
        />
      ) : (
        <ChatBubbleSender
          key={`${userPicUrl}-${chat.timestamp}`}
          url={userPicUrl}
          username={username!}
          time={chat.timestamp}
          content={chat.content}
        />
      )
    ));
    setChatBubbleList(bubbles);
  }

  const renderSidePanelBtns = () => {
    if (!chatUsers) return null;

    return chatUsers.map((user) => (
      <div key={user.id} className="flex border-b items-center gap-2 p-3 hover:bg-gray-100">
        <button className='py-2 w-full text-left flex flex-row gap-2 items-center cursor-pointer' 
          onClick={() => handleSelectChat(user.id, user.username, user.avatar)}>
          <img src={user.avatar} alt={user.username} className="w-8 h-8 rounded-full" />
          <div className="flex flex-col">
          <span className={`text-sm font-semibold flex ${user.unreadCount && user.unreadCount > 0 && 'text-red-500'} items-center gap-2`}>
            {user.username}
            
          </span>
          </div>
        </button>
        <button onClick={() => handleDeleteChat(user.id)} className="text-gray-500 hover:text-red-700 text-lg font-bold">
          <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    ));
  }

  useEffect(() => {
    renderChatBubbles();
  }, [chatTargetUid, readChats, isViewingChatLogsFromProfile]);

  useEffect(() => {
    scrollToBottom();
  }, [chatBubbleList]);

  return (
    <div className="fixed bottom-3 right-3 w-[640px] h-[480px] bg-white border shadow-2xl rounded-xl z-50 flex overflow-hidden">
      {/* Left Sidebar */}
      <div className="w-1/3 border-r bg-gray-50 overflow-y-auto">
        <div className="p-3 font-semibold border-b">Chats</div>
        {renderSidePanelBtns()}
      </div>

      {/* Right Chat Panel */}
      <div className="w-2/3 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{chatTargetUsername}</span>
          </div>
          <button onClick={closeChat} className="text-gray-500 hover:text-red-700 text-lg font-bold">
            <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {displayEmptyChat ? (
          <div className='flex justify-center items-center h-full'>
            Start a chat
          </div>
        ) : (
          <>
            {/* Messages */}
            <div className="flex flex-col gap-4 p-4 overflow-y-auto flex-grow">
              {chatBubbleList}
              <div ref={chatEndRef}></div>
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-3 border-t bg-gray-50">
              <div className="flex items-center px-3 py-2 bg-white border rounded-lg">
                <textarea
                  rows={1}
                  className="w-full p-2 text-sm text-gray-700 border-gray-300 rounded-lg resize-none focus:outline-none"
                  placeholder="Type here..."
                  onChange={handleChange}
                  value={message}
                />
                <button type="submit" className="p-2 text-blue-600 hover:bg-blue-100 rounded-full">
                  <svg className="w-5 h-5 rotate-90" fill="currentColor" viewBox="0 0 18 20">
                    <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z" />
                  </svg>
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
