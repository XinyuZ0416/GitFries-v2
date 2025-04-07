'use client'
import ProfileAchievementsCard from '@/components/profile/achievements'
import ProfileActivities from '@/components/profile/activities/activities'
import ProfileDashboardCard from '@/components/profile/dashboard'
import ProfilePicCard from '@/components/profile/bio'
import React from 'react'

export default function ProfilePage() {
  
  // TODO: if no user/ user not verified, dont show content
  return (
    <>
    <div className='flex flex-col gap-2'>
      <div className='flex flex-row gap-2 w-full'>
        <div className='flex flex-col gap-2 w-fit justify-between'>
          <ProfilePicCard />
          <ProfileAchievementsCard />
        </div>
        <ProfileDashboardCard />
      </div>
      <ProfileActivities />
    </div>
    </>
  )
}
