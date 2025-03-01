import ProfileBadgeCard from '@/components/profile-badge-card'
import ProfilePicCard from '@/components/profile-pic-card'
import React from 'react'

export default function ProfilePage() {
  return (
    <>
    <div className='flex flex-row gap-2 justify-around'>
      <ProfilePicCard />
      <ProfileBadgeCard />
    </div>
    </>
  )
}
