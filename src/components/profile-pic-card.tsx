import React from 'react'

export default function ProfilePicCard() {
  return (
    <>
    <div className='flex flex-col flex-grow w-full max-w-md justify-center items-center rounded-lg shadow-sm p-4 bg-white'>
      <img className='rounded-full size-14' src='/potato.png' alt='user profile picture' />
      <h2 className='text-2xl font-bold'>Leah</h2>
      <p className='font-normal'>A CS student that loves fries</p>
      <img className='size-5' src='/link.png' alt='user link' />
    </div>
    </>
  )
}
