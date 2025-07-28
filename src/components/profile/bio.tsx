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
    <div className='border-2 border-black shadow-[4px_4px_0px_0px_black] flex flex-col flex-grow w-full max-w-md justify-center items-center rounded-lg p-4 bg-white'>
      <img className='rounded-full size-14' src={userPicUrl || "/potato.png"} alt='user profile picture' />
      <h2 className='text-2xl font-bold'>{username}</h2>
      <p className='font-normal'>{bio}</p>
      { uid && uid != userId &&
        <button onClick={() => openChat(userId!, username!, userPicUrl!)}>
          <img src='/start-chat.png' className='size-10' alt='start chat logo' title='start chatting' />
        </button>
      }
    </div>
    </>
  )
}
