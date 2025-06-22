import React from 'react'
import ActivitiesAchievementsCard from './activities/achievements'

interface ProfileAchievementsCardProps {
  achievements: Record<string, boolean>;
}

export default function ProfileAchievementsCard({achievements}: ProfileAchievementsCardProps) {
  const renderActivitiesAchievementsCard = () => {
   if (achievements) {
    return Object.entries(achievements) 
    .map(([key, _]) => { // Take the variable name
      const kebabCase = key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
      const spacedName = key.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();
      const titleCase = spacedName.replace(/\b\w/g, char => char.toUpperCase());

      return (
        <ActivitiesAchievementsCard
          key={key}
          src={`/achievements/colorful/${kebabCase}.png`}
          alt={titleCase}
          picTitle={titleCase}
          title={titleCase}
        />
      );
    });
   }
  };

  return (
    <>
    <div className='flex flex-col flex-grow justify-center items-center rounded-lg shadow-sm p-4 bg-white'>
      <div className='flex flex-row gap-2 items-center mr-auto'>
        <img className='size-14' src='/badge.png' alt='user profile picture' />
        <h2 className='text-2xl font-bold'>Achievements</h2>
      </div>

      <div className='flex flex-row gap-2'>
        { renderActivitiesAchievementsCard() }
      </div>
    </div>
    </>
  )
}
