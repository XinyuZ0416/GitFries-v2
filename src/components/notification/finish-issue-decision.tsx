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
      <div className='flex flex-col rounded-lg shadow-sm p-4 gap-2 bg-white hover:bg-gray-100'>
        <h3 className='text-lg font-semibold'>@{senderUsername} has { decision === "request_finish_issue_accept" ? "accepted" : "declined"} your request to finish issue "{issueTitle}"</h3>
        <p className="font-normal">{formatDate(time?.toDate() as Date)}</p>
      </div>
    </Link>
    </>
  )
}
