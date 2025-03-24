import formatDate from '@/utils/format-date'
import { Timestamp } from 'firebase/firestore'
import React from 'react'

interface NotificationsClaimCardProps {
  senderId: string,
  issueId: string,
  message: string,
  issueDescription: string,
  time: Timestamp,
}

export default function NotificationsClaimCard({senderId, issueId, message, issueDescription, time}: NotificationsClaimCardProps) {
  return (
    <>
    <div className='flex flex-col rounded-lg shadow-sm p-4 gap-2 bg-white hover:bg-gray-100'>
      <h3 className='text-lg font-semibold'>@{senderId} would like to claim your issue "{issueId}"</h3>
      <p className="font-normal">{message}</p>
      <div className='border-l-4 pl-3'>
        <p className="font-normal text-gray-400">{issueDescription}</p>
      </div>
      <p className="font-normal">{formatDate(time.toDate() as Date)}</p>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <a href="#" className="inline-flex justify-center w-full px-2 py-1.5 text-xs font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300">Accept</a>
        </div>
        <div>
          <a href="#" className="inline-flex justify-center w-full px-2 py-1.5 text-xs font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200">Decline</a> 
        </div>
      </div>    
    </div>
    </>
  )
}
