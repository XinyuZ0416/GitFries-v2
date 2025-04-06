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
    <div className='flex flex-col rounded-lg shadow-sm p-4 gap-2 bg-white hover:bg-gray-100'>
      <Link href={`/issues/${issueId}`}>
      <h3 className='text-lg font-semibold'>@{senderUsername} would like to finish your issue "{issueTitle}"</h3>
      <p className="font-normal">{formatDate(time?.toDate() as Date)}</p>
      </Link>
      <div className="grid grid-cols-2 gap-2">
        { 
          isAccepted === null ? 
            <>
              <div>
                <button className="inline-flex justify-center w-full px-2 py-1.5 text-xs font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300"
                  onClick={handleAccept}>
                  Accept
                </button>
              </div>
              <div>
                <button className="inline-flex justify-center w-full px-2 py-1.5 text-xs font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200"
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
