import ProfileAchievementsCard from '@/components/profile-achievements-card'
import ProfileActivitiesCard from '@/components/profile-activities-card'
import ProfileDashboardCard from '@/components/profile-dashboard-card'
import ProfilePicCard from '@/components/profile-pic-card'
import React from 'react'

export default function ProfilePage() {
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
      <ProfileActivitiesCard />
    </div>
    </>
  )
}
