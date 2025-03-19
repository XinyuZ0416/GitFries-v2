import formatDate from '@/utils/format-date';
import { Timestamp } from 'firebase/firestore'
import React from 'react'

interface PreviewCardProps {
  issueId: string,
  description: string,
  difficulty: string,
  isUrgent: boolean,
  issueReporterUid: string,
  language: string,
  time: Timestamp,
  title: string,
  url: string,
  issueReporterUsername: string,
  issueReporterPicUrl: string,
}

export default function PreviewCard({
  issueId, description, difficulty, isUrgent, issueReporterUid, 
  language, time, title, url, issueReporterUsername, issueReporterPicUrl,
} : PreviewCardProps) {

  const formattedDate = formatDate(time.toDate());

  return (
    <>
    <a href="/issues/1" className="flex flex-row p-3 items-center bg-white rounded-lg shadow-sm hover:bg-gray-100">
      <div>
        <img className="rounded-full size-14" src={issueReporterPicUrl} alt="user profile" />
        <h6 className='text-lg font-bold'>{issueReporterUsername}</h6>
      </div>

      <div className="flex flex-col justify-between px-4 py-2">
        <h5 className="text-xl font-bold">{title}</h5>
        <p className="font-normal text-gray-700">{description}</p>
      </div>

      <div>
        <p className="font-normal text-gray-700">{formattedDate}</p>
        <p className="font-normal text-gray-700">{language}</p>
      </div>
    </a>
    </>
  )
}
