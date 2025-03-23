'use client'
import NotificationsCommentCard from '@/components/notifications-comment-card'
import NotificationsReplyCard from '@/components/notifications-reply-card'
import { useAuthProvider } from '@/providers/auth-provider'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import React, { useEffect } from 'react'
import { db } from '../firebase'
import { useCurrentUserDocProvider } from '@/providers/current-user-doc-provider'

export default function NotificatonsPage() {

  return (
    <>
    <div className='flex flex-col gap-2'>
      <NotificationsCommentCard />
      <NotificationsReplyCard />
    </div>
    </>
  )
}
