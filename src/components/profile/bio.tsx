'use client'
import React from 'react'

interface ProfilePicCardProps {
  username: string,
  bio: string,
  userPicUrl: string,
}

export default function ProfilePicCard({
  username,
  bio,
  userPicUrl}: ProfilePicCardProps) {
  return (
    <>
    <div className='flex flex-col flex-grow w-full max-w-md justify-center items-center rounded-lg shadow-sm p-4 bg-white'>
      <img className='rounded-full size-14' src={userPicUrl || "/potato.png"} alt='user profile picture' />
      <h2 className='text-2xl font-bold'>{username}</h2>
      <p className='font-normal'>{bio}</p>
    </div>
    </>
  )
}
