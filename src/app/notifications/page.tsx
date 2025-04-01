'use client'
import { useAuthProvider } from '@/providers/auth-provider'
import { DocumentData, arrayUnion, deleteField, doc, getDoc, updateDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { db } from '../firebase'
import { useCurrentUserDocProvider } from '@/providers/current-user-doc-provider'
import IssueClaimCard from '@/components/notif-claim-card'
import IssueClaimDecisionCard from '@/components/issue-claim-decision-card'
import DisclaimIssueCard from '@/components/disclaim-issue-card'
import IssueFinishCard from '@/components/notif-finish-card'
import IssueFinishDecisionCard from '@/components/issue-finish-decision-card'
import CommentOnIssueCard from '@/components/notif-comment-on-issue-card'

export default function NotificatonsPage() {
  const [ readNotif, setReadNotif ] = useState<string[]>([])
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
  
  return (
    <>
    <div className='flex flex-col gap-2'>
      Your notifications will be automatically deleted after 1 month
      { readNotifArr.length > 0 ?
          readNotifArr.map((notif) => (
            notif.type === "request_claim_issue" ? 
              <IssueClaimCard
                key={notif?.id}
                currentNotifId={notif?.id}
                senderUsername={notif?.senderUsername}
                senderId={notif?.senderId}
                issueId={notif?.issueId}
                issueTitle={notif?.issueTitle}
                message={notif?.message}
                time={notif?.timestamp}
              /> : 
            notif.type === "disclaim_issue" ? 
              <DisclaimIssueCard
                key={notif?.id}
                senderUsername={notif?.senderUsername}
                issueId={notif?.issueId}
                issueTitle={notif?.issueTitle}
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
            notif.type === "request_finish_issue" ? 
              <IssueFinishCard
                key={notif?.id}
                currentNotifId={notif?.id}
                senderUsername={notif?.senderUsername}
                senderId={notif?.senderId}
                issueId={notif?.issueId}
                issueTitle={notif?.issueTitle}
                time={notif?.timestamp}
              /> :
            notif.type === "request_finish_issue_accept" ? 
              <IssueFinishDecisionCard
                key={notif?.id}
                decision={notif.type}
                senderUsername={notif?.senderUsername}
                issueId={notif?.issueId}
                issueTitle={notif?.issueTitle}
                time={notif?.timestamp}
              /> :
            notif.type === "request_finish_issue_decline" ? 
              <IssueFinishDecisionCard
                key={notif?.id}
                decision={notif.type}
                senderUsername={notif?.senderUsername}
                issueId={notif?.issueId}
                issueTitle={notif?.issueTitle}
                time={notif?.timestamp}
              /> :
            notif.type === "comment_on_issue" ? 
              <CommentOnIssueCard
                key={notif?.id}
                senderUsername={notif?.senderUsername}
                issueId={notif?.issueId}
                issueTitle={notif?.issueTitle}
                comment={notif?.message}
                time={notif?.timestamp}
              /> :
            ''
          )) : 
        "No notifications yet"
      }
      
      {/* <NotificationsCommentCard />
      <NotificationsReplyCard /> */}
    </div>
    </>
  )
}
