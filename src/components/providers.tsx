'use client'
import { auth, db, storage } from "@/app/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import React, { createContext, useContext, useEffect, useState } from "react";

// auth context
interface AuthContextProps {
  uid: string,
  setUid: React.Dispatch<React.SetStateAction<string>>,
  email: string,
  setEmail: React.Dispatch<React.SetStateAction<string>>,
  isVerified: boolean,
  setIsVerified: React.Dispatch<React.SetStateAction<boolean>>,
  userDbId: string,
  userPicUrl: string,
  setUserPicUrl: React.Dispatch<React.SetStateAction<string>>,
}

const AuthContext = createContext<AuthContextProps | null>(null);

export const AuthProvider = ({children}:{children: React.ReactNode}) => {
  const [uid, setUid] = useState<string>('');
  const [userDbId, setUserDbId] = useState<string>('');
  const [userPicUrl, setUserPicUrl] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [isVerified, setIsVerified] = useState<boolean>(false);

  useEffect(() => {
    console.log(auth)
    const unsubscribe = onAuthStateChanged(auth, async(user) => {
      // User is signed out, do nothing
      if (!user) return;

      // User is signed in
      setUid(user.uid);
      setEmail(user.email!);
      setIsVerified(user.emailVerified);

      // Fetch user pic: if no pic stored, default pic to potato
      try {
        setUserPicUrl(await getDownloadURL(ref(storage, `user-img/${user.uid}`)));
      } catch {
        setUserPicUrl(await getDownloadURL(ref(storage, `user-img/potato.png`)));
      }

      // If user email not verified, don't create user in db
      if (!user.emailVerified) {
        console.log("User email not verified. Skipping Firestore creation.");
        return;
      }

      // User email verified, check if user exists in db. 
      // If not, create user ( user.uid as document id )
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (!userDocSnap.exists()) {
        await setDoc(userDocRef, {
          uid: user.uid,
          email: user.email,
        });
        console.log("Created user in db!");
      }

      setUserDbId(user.uid);
    });
    return () => unsubscribe(); // Clean up
  }, []);

  return(
    <AuthContext.Provider 
      value={{
        uid, setUid, 
        email, setEmail, 
        isVerified, setIsVerified, 
        userDbId, 
        userPicUrl, setUserPicUrl}}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if(!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
