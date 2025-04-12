'use client'
import { useAchievementsProvider } from '@/providers/achievements-provider';
import React from 'react'
import AchievementPopover from './popover';

export default function AchievementsWrapper() {
  const { hasPostedIssues, hasFaved20Issues, hasFinished10Issues, has50Comments } = useAchievementsProvider();
  return (
    <>
    { hasPostedIssues && <AchievementPopover /> }
    { hasFaved20Issues && <AchievementPopover /> }
    { hasFinished10Issues && <AchievementPopover /> }
    { has50Comments && <AchievementPopover /> }
    </>
  )
}
