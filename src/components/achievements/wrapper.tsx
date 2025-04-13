'use client'
import { useAchievementsProvider } from '@/providers/achievements-provider';
import React from 'react'
import AchievementPopover from './popover';

export default function AchievementsWrapper() {
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
  return (
    <>
    { freshStarter.achieved && <AchievementPopover /> }
    { firstDetonation.achieved && <AchievementPopover /> }
    { issueHoarder.achieved && <AchievementPopover /> }
    { bugDestroyer.achieved && <AchievementPopover /> }
    { commentGoblin.achieved && <AchievementPopover /> }
    { mergeMonarch.achieved && <AchievementPopover /> }
    { issueFisher.achieved && <AchievementPopover /> }
    { speedyGonzales.achieved && <AchievementPopover /> }
    { timeTraveller.achieved && <AchievementPopover /> }
    </>
  )
}
