import formatDate from '@/utils/format-date'
import { Timestamp } from 'firebase/firestore/lite'
import Link from 'next/link'
import React from 'react'

interface RequestClaimCardProps {
  issueId: string,
  title: string,
  time: Timestamp
}

export default function RequestClaimCard({ issueId, title, time } : RequestClaimCardProps) {
  return (
    <>
    <Link href={`/issues/${issueId}`}>
    <div className='flex flex-col rounded-lg shadow-sm p-4 gap-2 bg-white hover:bg-gray-100'>
      <h3 className='text-lg font-semibold'>Requested to claim issue "{title}"</h3>
      <p className="font-normal">{formatDate(time.toDate() as Date)}</p>
    </div>
    </Link>
    </>
  )
}
