'use client'
import { db } from "@/app/firebase";
import { DocumentData, doc, getDoc, onSnapshot } from "firebase/firestore";
import React, { createContext, useContext, useEffect, useReducer, useState } from "react";
import { useAuthProvider } from "./auth-provider";

// current user context
interface CurrentUserDocContextProps {
  dispatch: React.Dispatch<Action>,
  favedIssues: string[],
  claimedIssues: string[],
  disclaimedIssuesCount: number,
  requestingToClaimIssues: string[],
  unreadNotif: string[],
}

type Action = { type: "SET_FAVED_ISSUES"; payload: string[] } |
              { type: "SET_CLAIMED_ISSUES"; payload: string[] } |
              { type: "SET_DISCLAIMED_ISSUES_COUNT"; payload: number } |
              { type: "SET_REQUESTING_TO_CLAIM_ISSUES"; payload: string[] } |
              { type: "SET_UNREAD_NOTIF"; payload: string[] };

const CurrentUserDocContext = createContext<CurrentUserDocContextProps | null>(null);

export const CurrentUserDocProvider = ({children}:{children: React.ReactNode}) => {
  const { uid } = useAuthProvider();

  const initialState = {
    favedIssues: [] as string[],
    claimedIssues: [] as string[],
    disclaimedIssuesCount: 0,
    requestingToClaimIssues: [] as string[],
    unreadNotif: [] as string[],
  }

  const reducer = (state: typeof initialState, action: Action) => {
    switch (action.type) {
      case "SET_FAVED_ISSUES":
        return { ...state, favedIssues: action.payload };
      case "SET_CLAIMED_ISSUES":
        return { ...state, claimedIssues: action.payload };
      case "SET_DISCLAIMED_ISSUES_COUNT":
        return { ...state, disclaimedIssuesCount: action.payload }
      case "SET_REQUESTING_TO_CLAIM_ISSUES":
        return { ...state, requestingToClaimIssues: action.payload };
      case "SET_UNREAD_NOTIF":
        return { ...state, unreadNotif: action.payload };
      default:
        return state;
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (!uid) return;

    const ref = doc(db, "users", uid);

    const unsubscribe = onSnapshot(ref, (docSnap) => {
      if(docSnap.exists()){
        const data = docSnap.data();
        
        dispatch({ type: "SET_FAVED_ISSUES", payload: data?.favedIssues ?? []});
        dispatch({ type: "SET_CLAIMED_ISSUES", payload: data?.claimedIssues ?? []});
        dispatch({ type: "SET_DISCLAIMED_ISSUES_COUNT", payload: data?.disclaimedIssuesCount ?? 0});
        dispatch({ type: "SET_REQUESTING_TO_CLAIM_ISSUES", payload: data?.requestingToClaimIssues ?? []});
        dispatch({ type: "SET_UNREAD_NOTIF", payload: data?.unreadNotif ?? []});
      }
    })
    
    return () => unsubscribe();
  }, [uid]);

  return(
    <CurrentUserDocContext.Provider 
      value={{
        dispatch,
        favedIssues: state.favedIssues,
        claimedIssues: state.claimedIssues,
        disclaimedIssuesCount: state.disclaimedIssuesCount, 
        requestingToClaimIssues: state.requestingToClaimIssues,
        unreadNotif: state.unreadNotif,
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
