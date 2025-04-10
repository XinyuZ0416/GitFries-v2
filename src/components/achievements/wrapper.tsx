'use client'
import { useAchievementsProvider } from '@/providers/achievements-provider';
import React from 'react'
import AchievementPopover from './popover';

export default function AchievementsWrapper() {
  const { hasPostedIssues } = useAchievementsProvider();
  return (
    <>
    { hasPostedIssues && <AchievementPopover /> }
    </>
  )
}
