import React from 'react'
import ActivitiesAchievementsCard from './activities/achievements'
import { useAchievementsProvider } from '@/providers/achievements-provider';

export default function ProfileAchievementsCard() {
  const { 
    freshStarter,
    firstDetonation,
    issueHoarder,
    bugDestroyer,
    commentGoblin,
    mergeMonarch,
    issueFisher,
    speedyGonzales,
    timeTraveller 
  } = useAchievementsProvider();

  const achievements = {
    freshStarter,
    firstDetonation,
    issueHoarder,
    bugDestroyer,
    commentGoblin,
    mergeMonarch,
    issueFisher,
    speedyGonzales,
    timeTraveller
  };

  const renderActivitiesAchievementsCard = () => {
    /*  Object.entries(achievements) convert achievements obj into an array of [key, value]
    * [
    *   ["freshStarter", { achieved: false, seen: false }],
    *   ["firstDetonation", { achieved: false, seen: false }],
    *   ...
    * ]
    */
    return Object.entries(achievements) 
      .filter(([_, value]) => value.achieved) // Find only achieved achievements, aka achieved: true
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
