import ProfileAchievementsCard from '@/components/profile-achievements-card'
import ProfileDashboardCard from '@/components/profile-dashboard-card'
import ProfilePicCard from '@/components/profile-pic-card'
import React from 'react'

export default function ProfilePage() {
  return (
    <>
    <div className='flex flex-col'>
      <div className='flex flex-row gap-2 w-full'>
        <div className='flex flex-col gap-2 min-w-fit justify-between'>
          <ProfilePicCard />
          <ProfileAchievementsCard />
        </div>
        <ProfileDashboardCard />
      </div>
    </div>
    </>
  )
}
