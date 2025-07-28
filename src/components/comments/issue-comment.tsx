import formatDate from '@/utils/format-date'
import MDEditor from '@uiw/react-md-editor'
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
    <div className='border-4 border-black shadow-[4px_4px_0px_0px_black] flex flex-col bg-white rounded-lg p-4 my-5 gap-3'>
      <div className="flex flex-row gap-3 items-center">
        <Link href={`/profile/${commenterUid}`}  className="flex flex-col items-center">
          <img className="rounded-full size-10" src={commenterPicUrl} alt="user profile" />
          <h6 className='text-lg font-bold'>{commenterUsername}</h6>
        </Link>
        <p className="font-normal text-gray-700 text-center">{formatDate(time?.toDate() as Date)}</p>
      </div>

      <div data-color-mode="light">
        <MDEditor.Markdown source={comment} />
      </div>
    </div>
    </>
  )
}
