'use client'
import { auth, db, storage } from "@/app/firebase";
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuthProvider } from "./auth-provider";

// current user context
interface CurrentUserDocContextProps {
  favedIssues: string[],
  setFavedIssues: React.Dispatch<React.SetStateAction<string[]>>,
}

const CurrentUserDocContext = createContext<CurrentUserDocContextProps | null>(null);

export const UserDocProvider = ({children}:{children: React.ReactNode}) => {
  const { uid } = useAuthProvider();
  const [ favedIssues, setFavedIssues ] = useState<string[]>([]);

  useEffect(() => {
    const getCurrentUserDoc = async() => {
      if(uid){
        try {
          const ref = doc(db, "users", uid);
          const docSnap = await getDoc(ref);
          const data = docSnap.data();

          setFavedIssues(data?.favedIssues ? data?.favedIssues : []);
        } catch (error: any) {
          console.error(error.code)
        }
      }
    }
    getCurrentUserDoc();
  }, [uid]);

  return(
    <CurrentUserDocContext.Provider 
      value={{favedIssues, setFavedIssues}}>
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
