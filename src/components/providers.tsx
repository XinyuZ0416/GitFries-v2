'use client'
import { auth, db, storage } from "@/app/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { addDoc, collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import { getDownloadURL, getMetadata, ref } from "firebase/storage";
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
      if (user) {
        // Get user pic, if no pic stored, default pic to potato
        try {
          const userPicUrl = await getDownloadURL(ref(storage, `user-img/${user.uid}`));
          setUserPicUrl(userPicUrl);
        } catch(error) {
          // console.error(error);

          try {
            const defaultUrl = await getDownloadURL(ref(storage, `user-img/potato.png`));
            setUserPicUrl(defaultUrl)
          } catch(error) {
            console.error(error);
          }
        }
        
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        setUid(user.uid);
        setEmail(user.email!);
        setIsVerified(user.emailVerified);

        // Check if user already exists
        const q = query(collection(db, "users"), where("uid", "==", user.uid));
        const querySnapshot = await getDocs(q);

        // Create user info in firebase if it's the first time user signs in after email verification
        if(user.emailVerified && user.metadata.creationTime === user.metadata.lastSignInTime ){
          if (querySnapshot.empty) {
            const createUserInfo = async() => {
              await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                email: user.email,
              });

              setUserDbId(user.uid);
            }
            createUserInfo();
          } else {
            setUserDbId(querySnapshot.docs[0].id);
          }
        }
      }
    });
    return () => unsubscribe(); // Clean up
  }, []);

  return(
    <AuthContext.Provider value={{uid, setUid, email, setEmail, isVerified, setIsVerified, userDbId, userPicUrl}}>
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
