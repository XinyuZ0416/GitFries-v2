'use client'
import { db } from '@/app/firebase';
import { useAuthProvider } from '@/providers/auth-provider';
import formatDate from '@/utils/format-date'
import { NotificationType } from '@/utils/notification-types';
import { Timestamp, addDoc, arrayRemove, arrayUnion, collection, doc, getDoc, updateDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'

interface NotificationsClaimCardProps {
  senderUsername: string,
  senderId: string,
  issueId: string,
  issueTitle: string,
  message: string,
  issueDescription: string,
  time: Timestamp,
}

export default function NotificationsClaimCard({senderUsername, senderId, issueId, issueTitle, message, issueDescription, time}: NotificationsClaimCardProps) {
  const [ description, setDescription] = useState<string>();
  const [ notifId, setNotifId] = useState<string>();
  const { uid, username } = useAuthProvider();
  const [ isAccepted, setIsAccepted ] = useState<boolean | null>(null);

  useEffect(() => {
    if (!issueId) return;

    const getIssueDescription = async() => {
      const docSnap = await getDoc(doc(db, "issues", issueId));
      
      if (docSnap.exists()) {
        setDescription(docSnap.data().description);
      } else {
        // TODO: error handling
      }
    }
    
    getIssueDescription();
  }, [issueId]);

  const removeFromRequestingToClaimIssues = async() => {
    await updateDoc(doc(db, "users", senderId), { requestingToClaimIssues: arrayRemove(issueId) });
  }

  const addToClaimedIssues = async() => {
    await updateDoc(doc(db, "users", senderId), { claimedIssues: arrayUnion(issueId) });
  }
  
  const notificationUpdate = async(notifType: NotificationType) => {
    // Create notification
    const notifDocRef = await addDoc(collection(db, "notifications"), {
      recipientId: senderId,
      senderId: uid,
      senderUsername: username,
      issueId: issueId,
      issueTitle: issueTitle,
      type: notifType,
      message: '',
      timestamp: Timestamp.fromDate(new Date()),
    });

    // Add to claim-request sender's unreadNotif
    await updateDoc(doc(db, "users", senderId), { unreadNotif: arrayUnion(notifDocRef.id) });
  }

  const handleAccept = () =>{
    removeFromRequestingToClaimIssues();
    notificationUpdate(NotificationType.REQ_C_I_A);
    addToClaimedIssues();
    // Add to issue coll claimedBy field

    // Add to claim-request sender's unread notifications

    // Update decision to db and show on page
    setIsAccepted(true);
  }

  const handleDecline = () =>{
    removeFromRequestingToClaimIssues();
    notificationUpdate(NotificationType.REQ_C_I_D);
    setIsAccepted(false);
  }

  return (
    <>
    <div className='flex flex-col rounded-lg shadow-sm p-4 gap-2 bg-white hover:bg-gray-100'>
      <h3 className='text-lg font-semibold'>@{senderUsername} would like to claim your issue "{issueTitle}"</h3>
      <p className="font-normal">{message}</p>
      <div className='border-l-4 pl-3'>
        <p className="font-normal text-gray-400">{description}</p>
      </div>
      <p className="font-normal">{formatDate(time?.toDate() as Date)}</p>
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
