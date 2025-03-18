'use client'
import { auth, db, storage } from "@/app/firebase";
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import React, { createContext, useContext, useEffect, useState } from "react";

// issue context
interface IssueContextProps {
  uid: string,
  setUid: React.Dispatch<React.SetStateAction<string>>,
}

const IssueContext = createContext<IssueContextProps | null>(null);

export const AuthProvider = ({children}:{children: React.ReactNode}) => {
  const [ uid, setUid ] = useState<string>('');


  return(
    <IssueContext.Provider 
      value={{}}>
      {children}
    </IssueContext.Provider>
  );
}

export const useIssueProvider = () => {
  const context = useContext(IssueContext);
  if(!context) {
    throw new Error('useAuth must be used within an IssueProvider');
  }
  return context;
}
