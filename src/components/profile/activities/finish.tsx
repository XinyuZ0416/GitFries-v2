import formatDate from '@/utils/format-date'
import { Timestamp } from 'firebase/firestore/lite'
import React from 'react'

interface FinishCardProps {
  title: string,
  time: Timestamp
}

export default function FinishCard({ title, time } : FinishCardProps) {
  return (
    <>
    <div className='flex flex-col rounded-lg shadow-sm p-4 gap-2 bg-white hover:bg-gray-100'>
      <h3 className='text-lg font-semibold'>Finished issue "{title}"</h3>
      <p className="font-normal">{formatDate(time.toDate() as Date)}</p>
    </div>
    </>
  )
}
