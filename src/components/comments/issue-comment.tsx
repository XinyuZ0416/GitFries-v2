import formatDate from '@/utils/format-date'
import { Timestamp } from 'firebase/firestore'
import Link from 'next/link'
import React from 'react'

interface IssueCommentCardProps {
  commenterUid: string,
  commenterUsername: string,
  commenterPicUrl: string
  comment: string,
  time: Timestamp
}

export default function IssueCommentCard({
  commenterUid,
  commenterUsername,
  commenterPicUrl,
  comment,
  time
}: IssueCommentCardProps) {
  return (
    <>
    <div className='flex flex-col bg-white border border-gray-200 rounded-lg shadow-sm'>
      <div className="flex flex-row p-3 gap-3 items-center">
        <Link href={`/profile/${commenterUid}`}>
          <img className="rounded-full size-10" src={commenterPicUrl} alt="user profile" />
          <h6 className='text-lg font-bold'>{commenterUsername}</h6>
        </Link>
        <p className="font-normal text-gray-700">{formatDate(time?.toDate() as Date)}</p>
      </div>

      <p className="font-normal text-gray-700">{comment}</p>

      <div className="flex ml-auto px-3 py-2">
        <button type="submit" className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800">
          Reply
        </button>
      </div>
    </div>
    </>
  )
}
