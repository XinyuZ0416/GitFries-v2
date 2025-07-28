'use client'
import { db } from '@/app/firebase';
import { useAuthProvider } from '@/providers/auth-provider';
import createNotif from '@/utils/create-notif';
import formatDate from '@/utils/format-date'
import { NotificationType } from '@/utils/notification-types';
import { Timestamp, arrayRemove, arrayUnion, deleteField, doc, getDoc, updateDoc } from 'firebase/firestore'
import Link from 'next/link';
import React, { useEffect, useState } from 'react'

interface FinishIssueCardProps {
  currentNotifId: string
  senderUsername: string,
  senderId: string,
  issueId: string,
  issueTitle: string,
  time: Timestamp,
}

export default function FinishIssueCard({currentNotifId, senderUsername, senderId, issueId, issueTitle, time}: FinishIssueCardProps) {
  const { uid, username } = useAuthProvider();
  const [ isAccepted, setIsAccepted ] = useState<boolean | null>(null);

  useEffect(() => {
    if (!issueId) return;

    const getNotifDecision = async() => {
      const docSnap = await getDoc(doc(db, "notifications", currentNotifId));

      if (docSnap.exists()) {
        if (docSnap.data().accepted !== undefined){
          setIsAccepted(docSnap.data().accepted);
        }
      } else {
        // TODO: error handling
      }
    }
    
    getNotifDecision();
  }, [issueId, currentNotifId]);

  const removeFromRequestingToFinishIssues = async() => {
    await updateDoc(doc(db, "users", senderId), { requestingToFinishIssues: arrayRemove(issueId) });
  }

  const addToFinishedIssues = async() => {
    await updateDoc(doc(db, "users", senderId), { 
      finishedIssues: arrayUnion({
        content: issueId,
        timestamp: Timestamp.fromDate(new Date()),
      }),
      activities: arrayUnion({
        content: issueId,
        type: NotificationType.REQ_F_I_A,
        timestamp: Timestamp.fromDate(new Date()),
      })
    });
  }

  const addFinishedBy = async() => {
    await updateDoc(doc(db, "issues", issueId), { finishedBy: senderId });
  }

  const deleteClaimedBy = async() => {
    await updateDoc(doc(db, "issues", issueId), { claimedBy: deleteField() });
  }

  // For rendering decisions on screen
  const updateCurrentNotifDecision = async(decision: boolean) => {
    await updateDoc(doc(db, "notifications", currentNotifId), { accepted: decision });
  }

  const handleAccept = () =>{
    removeFromRequestingToFinishIssues();
    createNotif(
      senderId, 
      uid, 
      username, 
      issueId!, 
      issueTitle, 
      NotificationType.REQ_F_I_A, 
      ""
    );
    addToFinishedIssues();
    addFinishedBy();
    deleteClaimedBy();
    updateCurrentNotifDecision(true);
    setIsAccepted(true);
  }

  // TODO: modify
  const handleDecline = () =>{
    removeFromRequestingToFinishIssues();
    createNotif(
      senderId, 
      uid, 
      username, 
      issueId!, 
      issueTitle, 
      NotificationType.REQ_F_I_D, 
      ""
    );
    updateCurrentNotifDecision(false);
    setIsAccepted(false);
  }

  return (
    <>
    <div className='my-5 transition-transform duration-150 hover:scale-105 border-2 border-black shadow-[4px_4px_0px_0px_black] flex flex-col rounded-lg p-4 gap-4 bg-white hover:bg-gray-100'>
      <Link href={`/issues/${issueId}`}>
      <h3 className='text-lg font-semibold'>@{senderUsername} would like to finish your issue "{issueTitle}"</h3>
      <p className="font-normal">{formatDate(time?.toDate() as Date)}</p>
      </Link>
      <div className="grid grid-cols-2 w-full">
        { 
          isAccepted === null ? 
            <>
              <div className='flex justify-center'>
                <button className="transition-transform duration-150 hover:scale-125 border-2 border-black shadow-[4px_4px_0px_0px_black] inline-flex justify-center w-36 px-2 py-1.5 text-md font-bold text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 text-bo"
                  onClick={handleAccept}>
                  Accept
                </button>
              </div>
              <div className='flex justify-center'>
                <button className="transition-transform duration-150 hover:scale-125 border-2 border-black shadow-[4px_4px_0px_0px_black] inline-flex justify-center w-36 px-2 py-1.5 text-md font-bold text-center text-gray-900 bg-white rounded-lg hover:bg-gray-100"
                  onClick={handleDecline}>
                  Decline
                </button>
              </div>
            </> :
            isAccepted ? 'You have accepted this request' : 'You have declined this request'
        }
      </div>    
    </div>
    </>
  )
}
