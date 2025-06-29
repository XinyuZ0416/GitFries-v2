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
  const [ badgeObj, setBadgeObj ] =  useState<BadgeObjType | null>(null);

  const handleCloseBadge = async( field: string ) => {
    await updateDoc(doc(db, "users", uid), { [`achievements.${field}`]: true });
    setBadgeObj((prev) => {
      if (!prev) return null; 
      return {
        ...prev,
        isShown: false
      };
    });
  }

  const achievementConditions = [
    {
      condition: freshStarter.achieved && !freshStarter.seen,
      field: "freshStarter",
      src: "/achievements/colorful/fresh-starter.png",
      alt: "Fresh Starter",
      title: "Fresh Starter",
      description: "Planted the seed, now watch it grow.",
      explanation: "Claimed and finished their first issue"
    }, {
      condition: firstDetonation.achieved && !firstDetonation.seen,
      field: "firstDetonation",
      src: "/achievements/colorful/first-detonation.png",
      alt: "First Detonation",
      title: "First Detonation",
      description: "Found the bug. Pulled the pin. Walked away in slow motion.",
      explanation: "Posted their first issue"
    }, {
      condition: issueHoarder.achieved && !issueHoarder.seen,
      field: "issueHoarder",
      src: "/achievements/colorful/issue-hoarder.png",
      alt: "Issue Hoarder",
      title: "Issue Hoarder",
      description: "If I hoarded it, I solved it!",
      explanation: "Favorited 20 issues"
    }, {
      condition: bugDestroyer.achieved && !bugDestroyer.seen,
      field: "bugDestroyer",
      src: "/achievements/colorful/bug-destroyer.png",
      alt: "Bug Destroyer",
      title: "Bug Destroyer",
      description: "What bugs?",
      explanation: "Finished 10 issues"
    }, {
      condition: commentGoblin.achieved && !commentGoblin.seen,
      field: "commentGoblin",
      src: "/achievements/colorful/comment-goblin.png",
      alt: "Comment Goblin",
      title: "Comment Goblin",
      description: "Lives in the comment section. Probably.",
      explanation: "Leaved 50 comments"
    }, {
      condition: mergeMonarch.achieved && !mergeMonarch.seen,
      field: "mergeMonarch",
      src: "/achievements/colorful/merge-monarch.png",
      alt: "Merge Monarch",
      title: "Merge Monarch",
      description: "All commits bow to your will!",
      explanation: "Received 10 requests to approve finished issues"
    }, {
      condition: issueFisher.achieved && !issueFisher.seen,
      field: "issueFisher",
      src: "/achievements/colorful/issue-fisher.png",
      alt: "Issue Fisher",
      title: "Issue Fisher",
      description: "Baited the hook, and the coders came biting.",
      explanation: "Received 10 requests to approve claimed issues"
    }, {
      condition: speedyGonzales.achieved && !speedyGonzales.seen,
      field: "speedyGonzales",
      src: "/achievements/colorful/speedy-gonzales.png",
      alt: "Speedy Gonzales",
      title: "Speedy Gonzales",
      description: "No fix too quick.",
      explanation: "Finished an issue within an hour after it's posted"
    }, {
      condition: timeTraveller.achieved && !timeTraveller.seen,
      field: "timeTraveller",
      src: "/achievements/colorful/time-traveller.png",
      alt: "Time Traveller",
      title: "Time Traveller",
      description: "They’re here to fix the past.",
      explanation: "Finished an issue a year after it's posted"
    }
  ];

  useEffect(() => {
    for (const achievement of achievementConditions) {
      if (achievement.condition) {
        setBadgeObj({
          isShown: true,
          handleClick: () => handleCloseBadge(achievement.field),
          src: achievement.src,
          alt: achievement.alt,
          title: achievement.title,
          description: achievement.description,
          explanation: achievement.explanation
        });

        break; // Show one badget at a time
      }
    }
  }, [
    freshStarter,
    firstDetonation,
    issueHoarder,
    bugDestroyer,
    commentGoblin,
    mergeMonarch,
    issueFisher,
    speedyGonzales,
    timeTraveller 
  ]);

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