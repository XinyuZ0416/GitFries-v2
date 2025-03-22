'use client'
import { db } from "@/app/firebase";
import { doc, getDoc } from "firebase/firestore";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuthProvider } from "./auth-provider";

// current user context
interface CurrentUserDocContextProps {
  favedIssues: string[],
  setFavedIssues: React.Dispatch<React.SetStateAction<string[]>>,
  claimedIssues: string[],
  setClaimedIssues: React.Dispatch<React.SetStateAction<string[]>>,
}

const CurrentUserDocContext = createContext<CurrentUserDocContextProps | null>(null);

export const CurrentUserDocProvider = ({children}:{children: React.ReactNode}) => {
  const { uid } = useAuthProvider();
  const [ favedIssues, setFavedIssues ] = useState<string[]>([]);
  const [ claimedIssues, setClaimedIssues ] = useState<string[]>([]);

  useEffect(() => {
    const getCurrentUserDoc = async() => {
      if(uid){
        try {
          const ref = doc(db, "users", uid);
          const docSnap = await getDoc(ref);
          const data = docSnap.data();

          setFavedIssues(data?.favedIssues ? data?.favedIssues : []);
          setClaimedIssues(data?.claimedIssues ? data?.claimedIssues : []);
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
        claimedIssues, setClaimedIssues
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
