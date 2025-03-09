'use client'
import { auth } from "@/app/firebase";
import { onAuthStateChanged } from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  uid: string,
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({children}:{children: React.ReactNode}) => {
  const [uid, setUid] = useState<string>('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        setUid(user.uid);
      }
    });
    return () => unsubscribe(); // clean up
  }, []);

  return(
    <AuthContext.Provider value={{uid}}>
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

