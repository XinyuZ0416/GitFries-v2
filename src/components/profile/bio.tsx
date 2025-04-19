'use client'
import { useChatProvider } from '@/providers/chat-provider';
import React from 'react'

interface ProfilePicCardProps {
  username: string,
  bio: string,
  userPicUrl: string,
  userId: string | undefined,
  uid: string | undefined,
}

export default function ProfilePicCard({
  username, bio, userPicUrl, userId, uid
}: ProfilePicCardProps) {
  const { openChat } = useChatProvider();
  
  return (
    <>
    <div className='flex flex-col flex-grow w-full max-w-md justify-center items-center rounded-lg shadow-sm p-4 bg-white'>
      <img className='rounded-full size-14' src={userPicUrl || "/potato.png"} alt='user profile picture' />
      <h2 className='text-2xl font-bold'>{username}</h2>
      <p className='font-normal'>{bio}</p>
      { uid && uid != userId &&
        <button onClick={() => openChat(userId!)}>Start Chat</button>
      }
    </div>
    </>
  )
}
