'use client'
import { db } from "@/app/firebase";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuthProvider } from "./auth-provider";
import { doc, onSnapshot } from "firebase/firestore";

// achievements context
interface AchievementsContextProps {
  hasPostedIssues: boolean,
  hasSeenFirstDetonationBadge: boolean | null,
}

const AchievementsContext = createContext<AchievementsContextProps | null>(null);

export const AchievementsProvider = ({children}:{children: React.ReactNode}) => {
  const { uid } = useAuthProvider();
  const [ hasPostedIssues, setHasPostedIssues ] = useState<boolean>(false);
  const [ hasSeenFirstDetonationBadge, setHasSeenFirstDetonationBadge ] = useState<boolean | null>(false);

  useEffect(() => {
    if (!uid) return;

    const userDocRef = doc(db, "users", uid);
    
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      const userData = docSnap.data();
      if (userData) {
        setHasPostedIssues(userData.hasPostedIssues);
        setHasSeenFirstDetonationBadge(userData.hasSeenFirstDetonationBadge);
      }
    });

    return () => unsubscribe(); // Cleanup
  }, [uid]);

  return(
    <AchievementsContext.Provider 
      value={{
        hasPostedIssues, hasSeenFirstDetonationBadge
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
