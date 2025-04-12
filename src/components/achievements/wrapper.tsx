'use client'
import { useAchievementsProvider } from '@/providers/achievements-provider';
import React from 'react'
import AchievementPopover from './popover';

export default function AchievementsWrapper() {
  const { hasFinishedFirstIssue, 
    hasPostedIssues, 
    hasFaved20Issues, 
    hasFinished10Issues, 
    has50Comments,
    received10RequestsToFinishIssue,
  } = useAchievementsProvider();
  return (
    <>
    { hasFinishedFirstIssue && <AchievementPopover /> }
    { hasPostedIssues && <AchievementPopover /> }
    { hasFaved20Issues && <AchievementPopover /> }
    { hasFinished10Issues && <AchievementPopover /> }
    { has50Comments && <AchievementPopover /> }
    { received10RequestsToFinishIssue && <AchievementPopover /> }
    </>
  )
}
