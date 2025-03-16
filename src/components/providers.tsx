'use client'
import { auth, db, storage } from "@/app/firebase";
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import React, { createContext, useContext, useEffect, useState } from "react";

// auth context
interface AuthContextProps {
  uid: string,
  setUid: React.Dispatch<React.SetStateAction<string>>,
  email: string,
  setEmail: React.Dispatch<React.SetStateAction<string>>,
  username: string,
  bio: string,
  isVerified: boolean | null,
  setIsVerified: React.Dispatch<React.SetStateAction<boolean | null>>,
  userDbId: string,
  userPicUrl: string,
  setUserPicUrl: React.Dispatch<React.SetStateAction<string>>,
}

const AuthContext = createContext<AuthContextProps | null>(null);

export const AuthProvider = ({children}:{children: React.ReactNode}) => {
  const [ uid, setUid ] = useState<string>('');
  const [ userDbId, setUserDbId ] = useState<string>('');
  const [ userPicUrl, setUserPicUrl ] = useState<string>('');
  const [ email, setEmail ] = useState<string>('');
  const [ username, setUsername] = useState<string>('');
  const [ bio, setBio ] = useState<string>('');
  const [ isVerified, setIsVerified ] = useState<boolean | null>(null);

  useEffect(() => {
    // console.log(auth)
    const unsubscribe = onAuthStateChanged(auth, async(user) => {
      // console.log(user)
      // User has not signed up
      if (!user) {
        setIsVerified(false);
        return; 
      }

      // User has signed up
      // Set basic info
      setUid(user.uid);
      setEmail(user.email!);
      setIsVerified(user.emailVerified);

      // If user email not verified, don't create user in db
      if (!user.emailVerified) {
        console.log("User email not verified. Skipping Firestore creation.");
        return;
      }

      // If user email verified
      // Fetch user pic: if no pic stored, default pic to potato
      try {
        const url = await getDownloadURL(ref(storage, `user-img/${user.uid}`));
        setUserPicUrl(url);
        await updateProfile(user, {photoURL: url});
      } catch {
        const fallbackUrl = await getDownloadURL(ref(storage, `user-img/potato.png`));
        setUserPicUrl(fallbackUrl);
        await updateProfile(user, {photoURL: fallbackUrl});
      }

      // Check if user exists in db: if not, create user ( user.uid as document id )
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (!userDocSnap.exists()) {
        await setDoc(userDocRef, {
          uid: user.uid,
          email: user.email,
          username: user.uid,
          bio: 'Each bite of fries gets me one byte closer to fixing this bug... or creating a new one?'
        });
        console.log("Created user in db!");
      }
      
      // Update username and bio
      const userData = userDocSnap.data();
      setUserDbId(user.uid);
      setUsername(userData?.username || '');
      setBio(userData?.bio || '');
      
      if (user.displayName !== userData?.username) {
        await updateProfile(user, {displayName: userData?.username || ''});
      }

      if (user.email !== userData?.email) {
        await updateDoc(doc(db, "users", user.uid), { email: user.email});
      }
    });
    return () => unsubscribe(); // Clean up
  }, [ username, bio, email ]);

  return(
    <AuthContext.Provider 
      value={{
        uid, setUid, 
        email, setEmail, 
        username, 
        bio,
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
