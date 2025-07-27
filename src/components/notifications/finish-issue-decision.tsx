'use client'
import formatDate from '@/utils/format-date'
import { Timestamp } from 'firebase/firestore'
import Link from 'next/link';
import React from 'react'

interface FinishIssueDecisionCardProps {
  decision: string,
  senderUsername: string,
  issueId: string,
  issueTitle: string,
  time: Timestamp,
}

export default function FinishIssueDecisionCard({decision, senderUsername, issueId, issueTitle, time}: FinishIssueDecisionCardProps) {

  return (
    <>
    <Link href={`/issues/${issueId}`}>
      <div className='my-5 transition-transform duration-150 hover:scale-105 border-4 border-black shadow-[4px_4px_0px_0px_black] flex flex-col rounded-lg p-4 gap-4 bg-white hover:bg-gray-100'>
        <h3 className='text-lg font-semibold'>@{senderUsername} has { decision === "request_finish_issue_accept" ? "accepted" : "declined"} your request to finish issue "{issueTitle}"</h3>
        <p className="font-normal">{formatDate(time?.toDate() as Date)}</p>
      </div>
    </Link>
    </>
  )
}
