'use client'
import { useAuthProvider } from '@/providers/auth-provider'
import { DocumentData, arrayUnion, deleteField, doc, getDoc, updateDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { db } from '../firebase'
import { useCurrentUserDocProvider } from '@/providers/current-user-doc-provider'
import ClaimIssueRequestCard from '@/components/notifications/claim-issue-request'
import ClaimIssueDecisionCard from '@/components/notifications/claim-issue-decision'
import DisclaimIssueCard from '@/components/notifications/disclaim-issue'
import FinishIssueCard from '@/components/notifications/finish-issue'
import FinishIssueDecisionCard from '@/components/notifications/finish-issue-decision'
import CommentOnIssueCard from '@/components/notifications/comment-on-issue'

export default function NotificatonsPage() {
  const [ readNotifArr, setReadNotifArr ] = useState<DocumentData[]>([])
  const { uid } = useAuthProvider();
  const{ unreadNotif, dispatch } = useCurrentUserDocProvider();

  const fetchReadNotif = async() => {
    const docSnap = await getDoc(doc(db, "users", uid));
  
    if (docSnap.exists()) {
      const readNotifArr = docSnap.data().readNotif || [];
      const arr: { id: string; timestamp?: { seconds: number }}[] = [];
  
      for (let notif of readNotifArr) {
        const notifSnap = await getDoc(doc(db, "notifications", notif));
        if (notifSnap.exists()) {
          const data = notifSnap.data() as { timestamp?: { seconds: number } };
          arr.push({
            id: notifSnap.id,
            ...data,
          });
        }
      }
  
      // Sort only if timestamp exists
      arr.sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));
      setReadNotifArr(arr);
    } else {
      console.error("User document not found");
    }
  };

  // Move unread notifications to read 
  useEffect(() => {
    if (!uid) return;

    const moveNotif = async() => {
      if (unreadNotif.length > 0) {
        // Add to read
        for (let notif of unreadNotif) {
          await updateDoc(doc(db, "users", uid), {readNotif:arrayUnion(notif)});
        }

        // Delete unread
        await updateDoc(doc(db, "users", uid), {unreadNotif:deleteField()});
        dispatch({ type: "SET_UNREAD_NOTIF", payload: [] });
      }
      await fetchReadNotif();
    }

    moveNotif();
  }, [uid]);

  const renderNotifCard = () => {
    return readNotifArr.length > 0 ? (
      readNotifArr.map((notif) => {
        switch (notif.type) {
          case "request_claim_issue":
            return (
              <ClaimIssueRequestCard
                key={notif.id}
                currentNotifId={notif.id}
                senderUsername={notif.senderUsername}
                senderId={notif.senderId}
                issueId={notif.issueId}
                issueTitle={notif.issueTitle}
                message={notif.message}
                time={notif.timestamp}
              />
            );
          case "disclaim_issue":
            return (
              <DisclaimIssueCard
                key={notif.id}
                senderUsername={notif.senderUsername}
                issueId={notif.issueId}
                issueTitle={notif.issueTitle}
                time={notif.timestamp}
              />
            );
          case "request_claim_issue_accept":
          case "request_claim_issue_decline":
            return (
              <ClaimIssueDecisionCard
                key={notif.id}
                decision={notif.type}
                senderUsername={notif.senderUsername}
                issueId={notif.issueId}
                issueTitle={notif.issueTitle}
                time={notif.timestamp}
              />
            );
          case "request_finish_issue":
            return (
              <FinishIssueCard
                key={notif.id}
                currentNotifId={notif.id}
                senderUsername={notif.senderUsername}
                senderId={notif.senderId}
                issueId={notif.issueId}
                issueTitle={notif.issueTitle}
                time={notif.timestamp}
              />
            );
          case "request_finish_issue_accept":
          case "request_finish_issue_decline":
            return (
              <FinishIssueDecisionCard
                key={notif.id}
                decision={notif.type}
                senderUsername={notif.senderUsername}
                issueId={notif.issueId}
                issueTitle={notif.issueTitle}
                time={notif.timestamp}
              />
            );
          case "comment":
            return (
              <CommentOnIssueCard
                key={notif.id}
                senderUsername={notif.senderUsername}
                issueId={notif.issueId}
                issueTitle={notif.issueTitle}
                comment={notif.message}
                time={notif.timestamp}
              />
            );
          default:
            return null;
        }
      })
    ) : (
      <p>No notifications yet</p>
    );
  };
  
  return (
    <>
    <div className='flex flex-col gap-2'>
    Your notifications will be automatically deleted after 1 month
      {renderNotifCard()}
    </div>
    </>
  )
}
