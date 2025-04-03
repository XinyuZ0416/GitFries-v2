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
    </div>
    </>
  )
}
