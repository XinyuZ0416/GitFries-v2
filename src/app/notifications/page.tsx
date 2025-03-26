'use client'
import NotificationsCommentCard from '@/components/notifications-comment-card'
import NotificationsReplyCard from '@/components/notifications-reply-card'
import { useAuthProvider } from '@/providers/auth-provider'
import { DocumentData, arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { db } from '../firebase'
import { useCurrentUserDocProvider } from '@/providers/current-user-doc-provider'
import NotificationsClaimCard from '@/components/notifications-claim-card'
import IssueClaimDecisionCard from '@/components/issue-claim-decision-card'

export default function NotificatonsPage() {
  const [ readNotif, setReadNotif ] = useState<string[]>([])
  const [ readNotifArr, setReadNotifArr ] = useState<DocumentData[]>([])
  const { uid } = useAuthProvider();
  const{ unreadNotif, setUnreadNotif } = useCurrentUserDocProvider();

  
  useEffect(() => {
    if (!uid) return;

    if (unreadNotif.length > 0) { // Move unread notifications to read
      const moveNotif = async() => {
        // Add to read
        for (let notif of unreadNotif) {
          await updateDoc(doc(db, "users", uid), {readNotif:arrayUnion(notif)});
          setReadNotif(prev => [...prev, notif]);
        }

        // Remove from unread
        await updateDoc(doc(db, "users", uid), {unreadNotif:[]});
        setUnreadNotif([]);
      }
      moveNotif();
    }

    // Render read notifications
    const fetchReadNotif = async() => {
      const docSnap = await getDoc(doc(db, "users", uid));

      if (docSnap.exists()) {
        const readNotifArr = docSnap.data().readNotif;
        const arr: { id: string, timestamp: { seconds: number}}[] = [];

        for (let notif of readNotifArr) {
          const docSnap = await getDoc(doc(db, "notifications", notif));
          arr.push({
            id: docSnap.id,
            ...(docSnap.data() as {timestamp: { seconds: number}})
          })
        }

        // Sort by time
        arr.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);
        setReadNotifArr(arr);
      } else {
        // TODO: error handling
      }
    }
    fetchReadNotif();
  }, [uid]);
  
  return (
    <>
    <div className='flex flex-col gap-2'>
      Your notifications will be automatically deleted after 1 month
      {
        readNotifArr.map((notif) => (
          notif.type === "request_claim_issue" ? 
            <NotificationsClaimCard
              key={notif?.id}
              currentNotifId={notif?.id}
              senderUsername={notif?.senderUsername}
              senderId={notif?.senderId}
              issueId={notif?.issueId}
              issueTitle={notif?.issueTitle}
              message={notif?.message}
              issueDescription={notif?.issueDescription}
              time={notif?.timestamp}
            /> : 
          notif.type === "request_claim_issue_accept" ? 
            <IssueClaimDecisionCard
              key={notif?.id}
              decision={notif.type}
              senderUsername={notif?.senderUsername}
              issueId={notif?.issueId}
              issueTitle={notif?.issueTitle}
              time={notif?.timestamp}
            /> :
          notif.type === "request_claim_issue_decline" ? 
            <IssueClaimDecisionCard
              key={notif?.id}
              decision={notif.type}
              senderUsername={notif?.senderUsername}
              issueId={notif?.issueId}
              issueTitle={notif?.issueTitle}
              time={notif?.timestamp}
            /> :
          ''
        ))
      }
      
      {/* <NotificationsCommentCard />
      <NotificationsReplyCard /> */}
    </div>
    </>
  )
}
