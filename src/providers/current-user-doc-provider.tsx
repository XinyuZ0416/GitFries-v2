'use client'
import { db } from "@/app/firebase";
import { DocumentData, doc, getDoc } from "firebase/firestore";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuthProvider } from "./auth-provider";

// current user context
interface CurrentUserDocContextProps {
  favedIssues: string[],
  setFavedIssues: React.Dispatch<React.SetStateAction<string[]>>,
  claimedIssues: string[],
  setClaimedIssues: React.Dispatch<React.SetStateAction<string[]>>,
  disclaimedIssuesCount: number,
  setDisclaimedIssuesCount: React.Dispatch<React.SetStateAction<number>>,
  requestingToClaimIssues: string[],
  setRequestingToClaimIssues: React.Dispatch<React.SetStateAction<string[]>>,
  unreadNotif: string[],
  setUnreadNotif: React.Dispatch<React.SetStateAction<string[]>>,
}

const CurrentUserDocContext = createContext<CurrentUserDocContextProps | null>(null);

export const CurrentUserDocProvider = ({children}:{children: React.ReactNode}) => {
  const { uid } = useAuthProvider();
  const [ favedIssues, setFavedIssues ] = useState<string[]>([]);
  const [ claimedIssues, setClaimedIssues ] = useState<string[]>([]);
  const [ disclaimedIssuesCount, setDisclaimedIssuesCount ] = useState<number>(0);
  const [ requestingToClaimIssues, setRequestingToClaimIssues ] = useState<string[]>([])
  const [ unreadNotif, setUnreadNotif ] = useState<string[]>([])

  useEffect(() => {
    const getCurrentUserDoc = async() => {
      if(uid){
        try {
          const ref = doc(db, "users", uid);
          const docSnap = await getDoc(ref);
          const data = docSnap.data();

          setFavedIssues(data?.favedIssues ? data?.favedIssues : []);
          setClaimedIssues(data?.claimedIssues ? data?.claimedIssues : []);
          setDisclaimedIssuesCount(data?.abandonedIssueCount ? data?.abandonedIssueCount : 0);
          setRequestingToClaimIssues(data?.requestingToClaimIssues ? data?.requestingToClaimIssues : []);
          setUnreadNotif(data?.unreadNotif ? data?.unreadNotif : []);
        } catch (error: any) {
          console.error(error.code)
        }
      }
    }
    getCurrentUserDoc();
  }, [uid]);

  return(
    <CurrentUserDocContext.Provider 
      value={{
        favedIssues, setFavedIssues,
        claimedIssues, setClaimedIssues,
        disclaimedIssuesCount, setDisclaimedIssuesCount,
        requestingToClaimIssues, setRequestingToClaimIssues,
        unreadNotif, setUnreadNotif,
      }}>
      {children}
    </CurrentUserDocContext.Provider>
  );
}

export const useCurrentUserDocProvider = () => {
  const context = useContext(CurrentUserDocContext);
  if(!context) {
    throw new Error('useCurrentUserDocProvider must be used within an CurrentUserDocProvider');
  }
  return context;
}
