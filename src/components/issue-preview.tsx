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
    <Link
      className={`
        flex flex-row p-4 h-32 my-3 overflow-hidden items-center rounded-lg
        shadow-[4px_4px_0px_0px_black] 
        ${isAvailable ? 'bg-yellow-300 hover:bg-yellow-400' : 'bg-yellow-200 hover:bg-yellow-200'}
        border-4 border-black
        transition-transform duration-150 hover:scale-105
        `}
      href={`/issues/${issueId}`}
    >
      <div className="flex flex-col justify-between px-4 py-2 w-5/6">
        <div className='flex flex-row gap-2 items-center'>
          {isUrgent && <img src='/urgent.png' className="w-10 h-10" alt='urgent logo' />}
          {difficulty === 'easy-fix' && <img src='/easy.png' className="w-10 h-10" alt='easy logo' />}
          <h5 className={`text-2xl font-extrabold tracking-wider ${isAvailable ? 'text-black' : 'text-gray-400'}`}>
            {title}
          </h5>
        </div>
        <p className={`font-semibold ${isAvailable ? 'text-yellow-800' : 'text-gray-400'} line-clamp-2`}>
          {description}
        </p>
      </div>

      <div className='w-1/6 text-center'>
        <p className={`font-semibold ${isAvailable ? 'text-black' : 'text-gray-400'}`}>{formattedDate}</p>
        <p className={`font-semibold ${isAvailable ? 'text-black' : 'text-gray-400'}`}>{language}</p>
        <p className={`font-semibold ${isAvailable ? 'text-black' : 'text-gray-400'}`}>{difficulty}</p>
      </div>
    </Link>

    </>
  )
}
