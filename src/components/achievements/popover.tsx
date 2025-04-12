'use client'
import React, { MouseEventHandler, useEffect, useState } from 'react'
import Badge from './badge'
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/app/firebase';
import { useAuthProvider } from '@/providers/auth-provider';
import { useAchievementsProvider } from '@/providers/achievements-provider';

interface BadgeObjType {
  isShown: boolean,
  handleClick: MouseEventHandler<HTMLButtonElement>,
  src: string,
  alt: string,
  title: string,
  description: string,
  explanation: string,
}

export default function AchievementPopover() {
  const { uid } = useAuthProvider();
  const { hasPostedIssues, hasSeenFirstDetonationBadge, hasFaved20Issues, hasSeenIssueHoarderBadge } = useAchievementsProvider();
  const [ badgeObj, setBadgeObj ] =  useState<BadgeObjType | null>(null);

  const handleCloseBadge = async(field: "firstDetonation" | "issueHoarder") => {
    await updateDoc(doc(db, "users", uid), { [`achievements.${field}`]: true });
    setBadgeObj((prev) => {
      if (!prev) return null; 
      return {
        ...prev,
        isShown: false
      };
    });
  }

  useEffect(() => {
    if (!hasPostedIssues) return;
    if (!hasSeenFirstDetonationBadge || hasSeenFirstDetonationBadge == null) {
      setBadgeObj({
        isShown: true,
        handleClick: () => handleCloseBadge("firstDetonation"),
        src: '/first-detonation.png',
        alt: 'first detonation',
        title: 'first detonation',
        description: 'Found the bug. Pulled the pin. Walked away in slow motion.',
        explanation: 'Posts their first issue',
      });
    }
  }, [hasPostedIssues, hasSeenFirstDetonationBadge]);

  useEffect(() => {
    if (!hasFaved20Issues) return;
    if (!hasFaved20Issues || hasSeenIssueHoarderBadge == null) {
      setBadgeObj({
        isShown: true,
        handleClick: () => handleCloseBadge("issueHoarder"),
        src: '/issue-hoarder.png',
        alt: 'issue hoarder',
        title: 'issue hoarder',
        description: 'If I hoarded it, I solved it!',
        explanation: 'Favorites 20 issues',
      });
    }
  }, [hasFaved20Issues, hasSeenIssueHoarderBadge]);

  return (
    <>
    {badgeObj &&
    <div className={`${badgeObj.isShown ? 'flex' : 'hidden'} fixed top-0 start-0 z-50 bg-slate-300/50 w-full h-full items-center justify-center`}>
      <div className="relative bg-white p-6 rounded-lg shadow-md max-w-md w-full">
        <div className="flex justify-end">
          <button onClick={badgeObj.handleClick} type="button" className="bg-white rounded-md p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
            <span className="sr-only">Close menu</span>
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <h1 className="text-2xl font-bold mb-4 text-center">You unlocked a new achievement!</h1>
        <Badge 
          src={badgeObj.src} 
          alt={badgeObj.alt}
          title={badgeObj.title}
          description={badgeObj.description}
          explanation={badgeObj.explanation}
        />
      </div>
    </div>
    }
    </>
  )
}
