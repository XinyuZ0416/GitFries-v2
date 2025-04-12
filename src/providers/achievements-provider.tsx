'use client'
import { db } from "@/app/firebase";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuthProvider } from "./auth-provider";
import { doc, onSnapshot } from "firebase/firestore";

// achievements context
interface AchievementsContextProps {
  hasPostedIssues: boolean,
  hasSeenFirstDetonationBadge: boolean | null,
  hasFaved20Issues: boolean,
  hasSeenIssueHoarderBadge: boolean | null,
  hasFinished10Issues: boolean,
  hasSeenBugDestroyerBadge: boolean | null,
}

const AchievementsContext = createContext<AchievementsContextProps | null>(null);

export const AchievementsProvider = ({children}:{children: React.ReactNode}) => {
  const { uid } = useAuthProvider();
  const [ hasPostedIssues, setHasPostedIssues ] = useState<boolean>(false);
  const [ hasSeenFirstDetonationBadge, setHasSeenFirstDetonationBadge ] = useState<boolean | null>(false);
  const [ hasFaved20Issues, setHasFaved20Issues ] = useState<boolean>(false);
  const [ hasSeenIssueHoarderBadge, setHasSeenIssueHoarderBadge ] = useState<boolean | null>(false);
  const [ hasFinished10Issues, setHasFinished10Issues ] = useState<boolean>(false);
  const [ hasSeenBugDestroyerBadge, setHasSeenBugDestroyerBadge ] = useState<boolean | null>(false);

  useEffect(() => {
    if (!uid) return;

    const userDocRef = doc(db, "users", uid);
    
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      const userData = docSnap.data();
      if (userData) {
        // First Detonation
        setHasPostedIssues(userData.hasPostedIssues);
        setHasSeenFirstDetonationBadge(userData.achievements?.firstDetonation);
        
        // Issue Hoarder
        if (userData.favedIssues && userData.favedIssues.length == 20){
          setHasFaved20Issues(true);
          setHasSeenIssueHoarderBadge(userData.achievements?.issueHoarder);
        }

        // Bug Destroyer
        if (userData.finishedIssues && userData.finishedIssues.length == 10){
          setHasFinished10Issues(true);
          setHasSeenBugDestroyerBadge(userData.achievements?.bugDestroyer);
        }
      }
    });

    return () => unsubscribe(); // Cleanup
  }, [uid]);

  return(
    <AchievementsContext.Provider 
      value={{
        hasPostedIssues, hasSeenFirstDetonationBadge,
        hasFaved20Issues, hasSeenIssueHoarderBadge,
        hasFinished10Issues, hasSeenBugDestroyerBadge
      }}>
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
