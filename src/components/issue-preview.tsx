import formatDate from '@/utils/format-date';
import { Timestamp } from 'firebase/firestore'
import Link from 'next/link';
import React, { useEffect } from 'react'

interface PreviewCardProps {
  issueId: string,
  description: string,
  difficulty: string,
  isUrgent: boolean,
  language: string,
  time: Timestamp,
  title: string,
  issueReporterUsername: string,
}

export default function PreviewCard({
  issueId, description, difficulty, isUrgent, 
  language, time, title, issueReporterUsername,
} : PreviewCardProps) {

  const formattedDate = formatDate(time.toDate());

  return (
    <>
    <Link className={`flex flex-row p-3 h-32 overflow-hidden items-center rounded-lg shadow-lg hover:bg-gray-100
      ${isUrgent ? `shadow-red-500` : `shadow-grey`}
      ${difficulty === `beginner-friendly` ? `bg-green-200` : `bg-white`}`}
      href={`/issues/${issueId}`} >
      <div>
        <h6 className='text-lg font-bold'>{issueReporterUsername}</h6>
      </div>

      <div className="flex flex-col justify-between px-4 py-2">
        <h5 className="text-xl font-bold">{title}</h5>
        <p className="font-normal text-gray-700">{description}</p>
      </div>

      <div>
        <p className="font-normal text-gray-700">{formattedDate}</p>
        <p className="font-normal text-gray-700">{language}</p>
        <p className="font-normal text-gray-700">{difficulty}</p>
      </div>
    </Link>
    </>
  )
}
