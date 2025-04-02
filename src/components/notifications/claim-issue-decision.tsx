'use client'
import formatDate from '@/utils/format-date'
import { Timestamp } from 'firebase/firestore'
import Link from 'next/link';
import React from 'react'

interface ClaClaimIssueDecisionCardProps {
  decision: string,
  senderUsername: string,
  issueId: string,
  issueTitle: string,
  time: Timestamp,
}

export default function ClaimIssueDecisionCard({decision, senderUsername, issueId, issueTitle, time}: ClaClaimIssueDecisionCardProps) {

  return (
    <>
    <Link href={`/issues/${issueId}`}>
      <div className='flex flex-col rounded-lg shadow-sm p-4 gap-2 bg-white hover:bg-gray-100'>
        <h3 className='text-lg font-semibold'>@{senderUsername} has { decision === "request_claim_issue_accept" ? "accepted" : "declined"} your request to claim issue "{issueTitle}"</h3>
        <p className="font-normal">{formatDate(time?.toDate() as Date)}</p>
      </div>
    </Link>
    </>
  )
}
