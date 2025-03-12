'use client'
import { auth, db } from "@/app/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import React, { createContext, useContext, useEffect, useState } from "react";

// auth context
interface AuthContextProps {
  uid: string,
  setUid: React.Dispatch<React.SetStateAction<string>>,
  email: string,
  setEmail: React.Dispatch<React.SetStateAction<string>>,
  isVerified: boolean,
  setIsVerified: React.Dispatch<React.SetStateAction<boolean>>,
}

const AuthContext = createContext<AuthContextProps | null>(null);

export const AuthProvider = ({children}:{children: React.ReactNode}) => {
  const [uid, setUid] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [isVerified, setIsVerified] = useState<boolean>(false);

  useEffect(() => {
    console.log(auth)
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        setUid(user.uid);
        setEmail(user.email!);
        setIsVerified(user.emailVerified);

        // create user info in firebase if it's the first time user signs in after email verification
        if(user.emailVerified && user.metadata.creationTime === user.metadata.lastSignInTime ){
          const createUserInfo = async() => {
            await addDoc(collection(db, "users"), {
              uid: user.uid,
              email: user.email,
            });
          }
          createUserInfo();
        }
      }
    });
    return () => unsubscribe(); // clean up
  }, []);

  return(
    <AuthContext.Provider value={{uid, setUid, email, setEmail, isVerified, setIsVerified, }}>
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
