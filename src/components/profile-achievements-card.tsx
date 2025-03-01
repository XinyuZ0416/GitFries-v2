import React from 'react'

export default function ProfileAchievementsCard() {
  return (
    <>
    <div className='flex flex-col flex-grow justify-center items-center rounded-lg shadow-sm p-4 bg-white'>
      <div className='flex flex-row gap-2 items-center mr-auto'>
        <img className='size-14' src='/badge.png' alt='user profile picture' />
        <h2 className='text-2xl font-bold'>My Achievements</h2>
      </div>

      <div className='flex flex-row gap-2'>
        <img className='size-14' src='/issue-hoarder.png' alt='issue hoarder' />
        <img className='size-14' src='/issue-hoarder.png' alt='issue hoarder' />
        <img className='size-14' src='/issue-hoarder.png' alt='issue hoarder' />
        <img className='size-14' src='/issue-hoarder.png' alt='issue hoarder' />
      </div>
      <p className='font-normal underline ml-auto'>More</p>
    </div>
    </>
  )
}
