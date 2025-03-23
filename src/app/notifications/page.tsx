'use client'
import NotificationsCommentCard from '@/components/notifications-comment-card'
import NotificationsReplyCard from '@/components/notifications-reply-card'
import { useAuthProvider } from '@/providers/auth-provider'
import { doc, getDoc } from 'firebase/firestore'
import React, { useEffect } from 'react'
import { db } from '../firebase'

export default function NotificatonsPage() {
  const { uid, userData } = useAuthProvider();

  useEffect(() => {
    const getUnreadNotif = () => {
      console.log(userData)
    }

    getUnreadNotif();
  }, [userData]);

  return (
    <>
    <div className='flex flex-col gap-2'>
      <NotificationsCommentCard />
      <NotificationsReplyCard />
    </div>
    </>
  )
}
