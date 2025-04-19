'use client'
import React, { createContext, useContext } from "react";
import { useAuthProvider } from "./auth-provider";
import useUserAchievements from "@/utils/custom-hooks/useUserAchievements";

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
  const achievements = useUserAchievements(uid);

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
