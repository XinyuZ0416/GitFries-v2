'use client'
import NotificationsCommentCard from '@/components/notifications-comment-card'
import NotificationsReplyCard from '@/components/notifications-reply-card'
import { useAuthProvider } from '@/providers/auth-provider'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import React, { useEffect } from 'react'
import { db } from '../firebase'
import { useCurrentUserDocProvider } from '@/providers/current-user-doc-provider'

export default function NotificatonsPage() {
  const { uid } = useAuthProvider();
  const{ unreadNotif, setUnreadNotif } = useCurrentUserDocProvider();

  // Clean up unread notifications
  useEffect(() => {
    if (unreadNotif.length > 0) {
      const cleanUpUnreadNotif = async() => {
        const ref = doc(db, "users", uid);
        await updateDoc(ref, {unreadNotif:[]});

        setUnreadNotif([]);
      }
      cleanUpUnreadNotif();
    }
  }, []);

  return (
    <>
    <div className='flex flex-col gap-2'>
      <NotificationsCommentCard />
      <NotificationsReplyCard />
    </div>
    </>
  )
}
