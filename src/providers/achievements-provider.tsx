'use client'
import { db } from "@/app/firebase";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuthProvider } from "./auth-provider";
import { doc, onSnapshot } from "firebase/firestore";

// achievements context
interface AchievementsContextProps {
  hasFinishedFirstIssue: boolean, hasSeenFreshStarterBadge: boolean | null,
  hasPostedIssues: boolean, hasSeenFirstDetonationBadge: boolean | null,
  hasFaved20Issues: boolean, hasSeenIssueHoarderBadge: boolean | null,
  hasFinished10Issues: boolean, hasSeenBugDestroyerBadge: boolean | null,
  has50Comments: boolean, hasSeenCommentGoblinBadge: boolean | null,
  received10RequestsToFinishIssue: boolean, hasSeenMergeMonarchBadge: boolean | null,
}

const AchievementsContext = createContext<AchievementsContextProps | null>(null);

export const AchievementsProvider = ({children}:{children: React.ReactNode}) => {
  const { uid } = useAuthProvider();
  // Fresh Starter
  const [ hasFinishedFirstIssue, setHasFinishedFirstIssue ] = useState<boolean>(false);
  const [ hasSeenFreshStarterBadge, setHasSeenFreshStarterBadge ] = useState<boolean | null>(false);
  // First Detonation
  const [ hasPostedIssues, setHasPostedIssues ] = useState<boolean>(false);
  const [ hasSeenFirstDetonationBadge, setHasSeenFirstDetonationBadge ] = useState<boolean | null>(false);
  // Issue Hoarder
  const [ hasFaved20Issues, setHasFaved20Issues ] = useState<boolean>(false);
  const [ hasSeenIssueHoarderBadge, setHasSeenIssueHoarderBadge ] = useState<boolean | null>(false);
  // Bug Destroyer
  const [ hasFinished10Issues, setHasFinished10Issues ] = useState<boolean>(false);
  const [ hasSeenBugDestroyerBadge, setHasSeenBugDestroyerBadge ] = useState<boolean | null>(false);
  // Comment Goblin
  const [ has50Comments, setHas50Comments ] = useState<boolean>(false);
  const [ hasSeenCommentGoblinBadge, setHasSeenCommentGoblinBadge ] = useState<boolean | null>(false);
  // Merge Monarch
  const [ received10RequestsToFinishIssue, setReceived10RequestsToFinishIssue ] = useState<boolean>(false);
  const [ hasSeenMergeMonarchBadge, setHasSeenMergeMonarchBadge ] = useState<boolean | null>(false);

  useEffect(() => {
    if (!uid) return;

    const userDocRef = doc(db, "users", uid);
    
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      const userData = docSnap.data();
      if (userData) {
        // Fresh Starter
        if (userData.finishedIssues && userData.finishedIssues.length == 1){
          setHasFinishedFirstIssue(true);
          setHasSeenFreshStarterBadge(userData.achievements?.freshStarter);
        }

        // First Detonation
        setHasPostedIssues(userData.achievementsHelpers?.hasPostedIssues);
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

        // Comment Goblin
        if (userData.comments && userData.comments.length == 50){
          setHas50Comments(true);
          setHasSeenCommentGoblinBadge(userData.achievements?.commentGoblin);
        }

        // Merge Monarch
        if (userData.achievementsHelpers?.receivedFinishIssueRequestsCounts && userData.achievementsHelpers?.receivedFinishIssueRequestsCounts == 10){
          setReceived10RequestsToFinishIssue(true);
          setHasSeenMergeMonarchBadge(userData.achievements?.mergeMonarch);
        }
      }
    });

    return () => unsubscribe(); // Cleanup
  }, [uid]);

  return(
    <AchievementsContext.Provider 
      value={{
        hasFinishedFirstIssue, hasSeenFreshStarterBadge,
        hasPostedIssues, hasSeenFirstDetonationBadge,
        hasFaved20Issues, hasSeenIssueHoarderBadge,
        hasFinished10Issues, hasSeenBugDestroyerBadge,
        has50Comments, hasSeenCommentGoblinBadge,
        received10RequestsToFinishIssue, hasSeenMergeMonarchBadge,
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
