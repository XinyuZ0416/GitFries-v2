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
  userPicUrl: string,
  setUserPicUrl: React.Dispatch<React.SetStateAction<string>>,
}

const AuthContext = createContext<AuthContextProps | null>(null);

export const AuthProvider = ({children}:{children: React.ReactNode}) => {
  const [ uid, setUid ] = useState<string>('');
  const [ userPicUrl, setUserPicUrl ] = useState<string>('');
  const [ email, setEmail ] = useState<string>('');
  const [ username, setUsername] = useState<string>('');
  const [ bio, setBio ] = useState<string>('');
  const [ isVerified, setIsVerified ] = useState<boolean | null>(null);

  // Set user basic info if user has signed in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async(user) => {
      if (!user) {
        setIsVerified(false);
        return; 
      }

      setUid(user.uid);
      setEmail(user.email!);
      setIsVerified(user.emailVerified);
    });

    return () => unsubscribe(); // Cleanup
  });

  // Fetch/ create user in db
  useEffect(() => {
    if (!uid || !isVerified) return;

    const fetchUserData = async() => {
      // Check if user exists in db: if not, create user ( user.uid as document id )
      const userDocRef = doc(db, "users", uid);
      const userDocSnap = await getDoc(userDocRef);
      if (!userDocSnap.exists()) {
        await setDoc(userDocRef, {
          uid: uid,
          email: email,
          username: uid,
          bio: 'Each bite of fries gets me one byte closer to fixing this bug... or creating a new one?'
        });
        console.log("Created user in db!");
      }

      // Update username and bio
      const userData = userDocSnap.data();
      setUsername(userData?.username || '');
      setBio(userData?.bio || '');

      if (auth.currentUser!.displayName !== userData?.username) {
        await updateProfile(auth.currentUser!, {displayName: userData?.username || ''});
      }

      if (auth.currentUser!.email !== userData?.email) {
        await updateDoc(doc(db, "users", uid), { email: auth.currentUser!.email});
      }
    }
    fetchUserData();
  }, [uid, isVerified]);

  // Fetch profile pic (default to potato pic if user hasn't updated)
  useEffect(() => {
    if(!uid) return;

    const fetchProfilePic = async() => {
      try {
        const url = await getDownloadURL(ref(storage, `user-img/${uid}`));
        setUserPicUrl(url);
        await updateProfile(auth.currentUser!, {photoURL: url});
      } catch {
        const fallbackUrl = await getDownloadURL(ref(storage, `user-img/potato.png`));
        setUserPicUrl(fallbackUrl);
        await updateProfile(auth.currentUser!, {photoURL: fallbackUrl});
      }
    }

    fetchProfilePic();
  }, [uid]);

  return(
    <AuthContext.Provider 
      value={{
        uid, setUid, 
        email, setEmail, 
        username, 
        bio,
        isVerified, setIsVerified, 
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
