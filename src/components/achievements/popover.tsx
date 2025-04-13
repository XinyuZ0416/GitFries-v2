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
    hasFinishedFirstIssue, hasSeenFreshStarterBadge,
    hasPostedIssues, hasSeenFirstDetonationBadge, 
    hasFaved20Issues, hasSeenIssueHoarderBadge,
    hasFinished10Issues, hasSeenBugDestroyerBadge,
    has50Comments, hasSeenCommentGoblinBadge,
    received10RequestsToFinishIssue, hasSeenMergeMonarchBadge,
    received10RequestsToClaimIssue, hasSeenIssueFisherBadge,
    finishedIssueWithinOneHour, hasSeenSpeedyGonzalesBadge,
    finishedIssueOneYearAfterPosted, hasSeenTimeTravellerBadge,
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
      condition: hasFinishedFirstIssue && !hasSeenFreshStarterBadge,
      field: "freshStarter",
      src: "/fresh-starter.png",
      alt: "fresh starter",
      title: "fresh starter",
      description: "Planted the seed, now watch it grow.",
      explanation: "Claims and finishes their first issue"
    }, {
      condition: hasPostedIssues && !hasSeenFirstDetonationBadge,
      field: "firstDetonation",
      src: "/first-detonation.png",
      alt: "first detonation",
      title: "first detonation",
      description: "Found the bug. Pulled the pin. Walked away in slow motion.",
      explanation: "Posts their first issue"
    }, {
      condition: hasFaved20Issues && !hasSeenIssueHoarderBadge,
      field: "issueHoarder",
      src: "/issue-hoarder.png",
      alt: "issue hoarder",
      title: "issue hoarder",
      description: "If I hoarded it, I solved it!",
      explanation: "Favorites 20 issues"
    }, {
      condition: hasFinished10Issues && !hasSeenBugDestroyerBadge,
      field: "bugDestroyer",
      src: "/bug-destroyer.png",
      alt: "bug destroyer",
      title: "bug destroyer",
      description: "What bugs?",
      explanation: "Finishes 10 issues"
    }, {
      condition: has50Comments && !hasSeenCommentGoblinBadge,
      field: "commentGoblin",
      src: "/comment-goblin.png",
      alt: "comment goblin",
      title: "comment goblin",
      description: "Lives in the comment section. Probably.",
      explanation: "Leaves 50 comments"
    }, {
      condition: received10RequestsToFinishIssue && !hasSeenMergeMonarchBadge,
      field: "mergeMonarch",
      src: "/merge-monarch.png",
      alt: "merge monarch",
      title: "merge monarch",
      description: "All commits bow to your will!",
      explanation: "Gets 10 requests to approve finished issues"
    }, {
      condition: received10RequestsToClaimIssue && !hasSeenIssueFisherBadge,
      field: "issueFisher",
      src: "/issue-fisher.png",
      alt: "issue fisher",
      title: "issue fisher",
      description: "Baited the hook, and the coders came biting.",
      explanation: "Receives 10 requests to approve claimed issues"
    }, {
      condition: finishedIssueWithinOneHour && !hasSeenSpeedyGonzalesBadge,
      field: "speedyGonzales",
      src: "/speedy-gonzales.png",
      alt: "speedy gonzales",
      title: "speedy gonzales",
      description: "No fix too quick.",
      explanation: "Finishes an issue within an hour after it's posted"
    }, {
      condition: finishedIssueOneYearAfterPosted && !hasSeenTimeTravellerBadge,
      field: "timeTraveller",
      src: "/time-traveller.png",
      alt: "time traveller",
      title: "time traveller",
      description: "They’re here to fix the past.",
      explanation: "Solves an issue that’s been posted for over a year"
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
    hasFinishedFirstIssue, hasSeenFreshStarterBadge,
    hasPostedIssues, hasSeenFirstDetonationBadge, 
    hasFaved20Issues, hasSeenIssueHoarderBadge, 
    hasFinished10Issues, hasSeenBugDestroyerBadge,
    has50Comments, hasSeenCommentGoblinBadge,
    received10RequestsToFinishIssue, hasSeenMergeMonarchBadge,
    finishedIssueOneYearAfterPosted, hasSeenTimeTravellerBadge,
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