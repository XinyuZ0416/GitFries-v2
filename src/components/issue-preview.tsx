import { useAuthProvider } from '@/providers/auth-provider';
import formatDate from '@/utils/format-date';
import { Timestamp } from 'firebase/firestore'
import Link from 'next/link';
import React, { useEffect, useState } from 'react'

interface PreviewCardProps {
  issueId: string,
  description: string,
  difficulty: string,
  isUrgent: boolean,
  language: string,
  time: Timestamp,
  title: string,
  claimedBy?: string,
  finishedBy?: string
}

export default function PreviewCard({
  issueId, description, difficulty, isUrgent, 
  language, time, title, claimedBy, finishedBy
} : PreviewCardProps) {
  const [ isAvailable, setIsAvailable ] = useState<boolean>(true);
  const { uid } = useAuthProvider();
  const formattedDate = formatDate(time.toDate());

  useEffect(() => {
    // If user signed out, show all issues as available
    if (!uid) {
      setIsAvailable(true); 
    } else {
      if (claimedBy != null || finishedBy != null) {
        setIsAvailable(false);
      }
    }
  }, [uid, claimedBy]);

  return (
    <>
    <Link className={`flex flex-row p-3 h-32 overflow-hidden items-center rounded-lg shadow-lg hover:bg-gray-100 bg-white`}
      href={`/issues/${issueId}`} >
      <div className="flex flex-col justify-between px-4 py-2 w-5/6">
        <div className='flex flex-row gap-2 items-center'>
          {isUrgent && <img src='/urgent.png' className="size-10" alt='urgent logo'/> }
          {difficulty === `easy-fix` && <img src='/easy.png' className="size-10" alt='easy logo'/> }
          <h5 className={`text-xl font-bold ${!isAvailable && `text-gray-300`}`}>{title}</h5>
        </div>
        <p className={`font-normal ${isAvailable ? `text-gray-700` : `text-gray-300`} line-clamp-2`}>{description}</p>
      </div>

      <div className='w-1/6'>
        <p className={`font-normal ${isAvailable ? `text-gray-700` : `text-gray-300`}`}>{formattedDate}</p>
        <p className={`font-normal ${isAvailable ? `text-gray-700` : `text-gray-300`}`}>{language}</p>
        <p className={`font-normal ${isAvailable ? `text-gray-700` : `text-gray-300`}`}>{difficulty}</p>
      </div>
    </Link>
    </>
  )
}
