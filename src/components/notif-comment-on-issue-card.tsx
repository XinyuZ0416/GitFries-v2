'use client'
import formatDate from '@/utils/format-date'
import { Timestamp } from 'firebase/firestore'
import Link from 'next/link';
import React from 'react'

interface CommentOnIssueCardProps {
  senderUsername: string,
  issueId: string,
  issueTitle: string,
  comment: string,
  time: Timestamp,
}

export default function CommentOnIssueCard({senderUsername, issueId, issueTitle, comment, time}: CommentOnIssueCardProps) {

  return (
    <>
    <Link href={`/issues/${issueId}`}>
      <div className='flex flex-col rounded-lg shadow-sm p-4 gap-2 bg-white hover:bg-gray-100'>
        <h3 className='text-lg font-semibold'>@{senderUsername} commented on your issue "{issueTitle}"</h3>
        <p className="font-normal">{comment}</p>
        <p className="font-normal">{formatDate(time?.toDate() as Date)}</p>
      </div>
    </Link>
    </>
  )
}
