import NotificationsCommentCard from '@/components/notifications-comment-card'
import NotificationsReplyCard from '@/components/notifications-reply-card'
import React from 'react'

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
