import formatDate from '@/utils/format-date';
import MDEditor from '@uiw/react-md-editor';
import { Timestamp } from 'firebase/firestore'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react'

interface PreviewCardProps {
  issueId: string,
  description: string,
  difficulty: string,
  isUrgent: boolean,
  language: string,
  time: Timestamp,
  title: string,
  issueReporterUsername: string,
  issueReporterPicUrl: string,
}

export default function PreviewCard({
  issueId, description, difficulty, isUrgent, 
  language, time, title, issueReporterUsername, issueReporterPicUrl,
} : PreviewCardProps) {

  const formattedDate = formatDate(time.toDate());
  const router = useRouter();

  return (
    <>
    <div className={`flex flex-row p-3 items-center rounded-lg shadow-lg hover:bg-gray-100
      ${isUrgent ? `shadow-red-500` : `shadow-grey`}
      ${difficulty === `beginner-friendly` ? `bg-green-200` : `bg-white`}`}
      onClick={() => router.push(`/issues/${issueId}`)}>
      <div>
        <img className="rounded-full size-14" src={issueReporterPicUrl} alt="user profile" />
        <h6 className='text-lg font-bold'>{issueReporterUsername}</h6>
      </div>

      <div className="flex flex-col justify-between px-4 py-2">
        <h5 className="text-xl font-bold">{title}</h5>
        <section id='issue-description' className='my-3' data-color-mode="light">
          <MDEditor.Markdown source={description} />
        </section>
      </div>

      <div>
        <p className="font-normal text-gray-700">{formattedDate}</p>
        <p className="font-normal text-gray-700">{language}</p>
        <p className="font-normal text-gray-700">{difficulty}</p>
      </div>
    </div>
    </>
  )
}
