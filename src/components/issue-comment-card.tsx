import React from 'react'

export default function IssueCommentCard() {
  return (
    <>
    <div className='flex flex-col bg-white border border-gray-200 rounded-lg shadow-sm'>
      <div className="flex flex-row p-3 gap-3 items-center">
        <img className="rounded-full size-10" src="/potato.png" alt="user profile" />
        <h6 className='text-lg font-bold'>Potato</h6>
        <p className="font-normal text-gray-700">Today</p>
      </div>

      <p className="font-normal text-gray-700">When outputting downloaded file in it should create directory with correct name according to music metadata. Instead, it creates  None directory for all downloaded music from one YTM Playlist.</p>

      <div className="flex ml-auto px-3 py-2">
        <button type="submit" className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800">
          Reply
        </button>
      </div>
    </div>
    </>
  )
}
