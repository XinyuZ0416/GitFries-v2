'use client'
import NotificationsCommentCard from '@/components/notifications-comment-card'
import NotificationsReplyCard from '@/components/notifications-reply-card'
import { useAuthProvider } from '@/providers/auth-provider'
import { arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { db } from '../firebase'
import { useCurrentUserDocProvider } from '@/providers/current-user-doc-provider'

export default function NotificatonsPage() {
  const [ readNotif, setReadNotif ] = useState<string[]>([])
  const { uid } = useAuthProvider();
  const{ unreadNotif, setUnreadNotif } = useCurrentUserDocProvider();

  // Move unread notifications to read
  useEffect(() => {
    if (unreadNotif.length > 0) {
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
  }, []);

  return (
    <>
    <div className='flex flex-col gap-2'>
      Your notifications will be automatically deleted after 1 month
      <NotificationsCommentCard />
      <NotificationsReplyCard />
    </div>
    </>
  )
}
