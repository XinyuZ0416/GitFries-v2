'use client'
import NotificationsCommentCard from '@/components/notifications-comment-card'
import NotificationsReplyCard from '@/components/notifications-reply-card'
import { useAuthProvider } from '@/providers/auth-provider'
import { DocumentData, arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { db } from '../firebase'
import { useCurrentUserDocProvider } from '@/providers/current-user-doc-provider'
import NotificationsClaimCard from '@/components/notifications-claim-card'

export default function NotificatonsPage() {
  const [ readNotif, setReadNotif ] = useState<string[]>([])
  const [ readNotifObj, setReadNotifObj ] = useState<DocumentData | undefined>()
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

        for (let notif of readNotifArr) {
          const docSnap = await getDoc(doc(db, "notifications", notif));
          setReadNotifObj(docSnap.data());
        }
        
      } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
      }
    }
    fetchReadNotif();

  }, [uid]);
  
  return (
    <>
    <div className='flex flex-col gap-2'>
      Your notifications will be automatically deleted after 1 month
      <NotificationsClaimCard />
      <NotificationsCommentCard />
      <NotificationsReplyCard />
    </div>
    </>
  )
}
