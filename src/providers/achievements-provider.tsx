'use client'
import { db } from "@/app/firebase";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuthProvider } from "./auth-provider";
import { doc, onSnapshot } from "firebase/firestore";

// Define achievement types
interface Achievement {
  achieved: boolean;
  seen: boolean | null;
}

interface AchievementsContextProps {
  freshStarter: Achievement;
  firstDetonation: Achievement;
  issueHoarder: Achievement;
  bugDestroyer: Achievement;
  commentGoblin: Achievement;
  mergeMonarch: Achievement;
  issueFisher: Achievement;
  speedyGonzales: Achievement;
  timeTraveller: Achievement;
}

const AchievementsContext = createContext<AchievementsContextProps | null>(null);

export const AchievementsProvider = ({children}:{children: React.ReactNode}) => {
  const { uid } = useAuthProvider();
  
  const [achievements, setAchievements] = useState<AchievementsContextProps>({
    freshStarter: { achieved: false, seen: false },
    firstDetonation: { achieved: false, seen: false },
    issueHoarder: { achieved: false, seen: false },
    bugDestroyer: { achieved: false, seen: false },
    commentGoblin: { achieved: false, seen: false },
    mergeMonarch: { achieved: false, seen: false },
    issueFisher: { achieved: false, seen: false },
    speedyGonzales: { achieved: false, seen: false },
    timeTraveller: { achieved: false, seen: false },
  });

  useEffect(() => {
    if (!uid) return;

    const userDocRef = doc(db, "users", uid);
    
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      const userData = docSnap.data();
      if (!userData) return;

      const newAchievements = { ...achievements };

      if (userData.finishedIssues) {
        newAchievements.freshStarter.achieved = userData.finishedIssues.length == 1;
        newAchievements.bugDestroyer.achieved = userData.finishedIssues.length == 10;
      }

      if (userData.achievementsHelpers) {
        const helpers = userData.achievementsHelpers;
        newAchievements.firstDetonation.achieved = helpers.hasPostedIssues ?? false;
        newAchievements.mergeMonarch.achieved = helpers.receivedFinishIssueRequestsCounts == 10;
        newAchievements.issueFisher.achieved = helpers.receivedClaimIssueRequestsCounts == 10;
        newAchievements.speedyGonzales.achieved = helpers.finishedIssueOneHourAfterPosted ?? false;
        newAchievements.timeTraveller.achieved = helpers.finishedIssueOneYearAfterPosted ?? false;
      }

      if (userData.achievements) {
        const achievements = userData.achievements;
        newAchievements.freshStarter.seen = achievements.freshStarter ?? false;
        newAchievements.firstDetonation.seen = achievements.firstDetonation ?? false;
        newAchievements.issueHoarder.seen = achievements.issueHoarder ?? false;
        newAchievements.bugDestroyer.seen = achievements.bugDestroyer ?? false;
        newAchievements.commentGoblin.seen = achievements.commentGoblin ?? false;
        newAchievements.mergeMonarch.seen = achievements.mergeMonarch ?? false;
        newAchievements.issueFisher.seen = achievements.issueFisher ?? false;
        newAchievements.speedyGonzales.seen = achievements.speedyGonzales ?? false;
        newAchievements.timeTraveller.seen = achievements.timeTraveller ?? false;
      }

      if (userData.favedIssues){
        newAchievements.issueHoarder.achieved = userData.favedIssues.length == 20;
      }

      if (userData.comments){
        newAchievements.commentGoblin.achieved = userData.comments.length == 50;
      }

      setAchievements(newAchievements);
    });

    return () => unsubscribe(); // Cleanup
  }, [uid]);

  return(
    <AchievementsContext.Provider value={achievements}>
      {children}
    </AchievementsContext.Provider>
  );
}

export const useAchievementsProvider = () => {
  const context = useContext(AchievementsContext);
  if(!context) {
    throw new Error('useAchievements must be used within an AchievementsProvider');
  }
  return context;
}
