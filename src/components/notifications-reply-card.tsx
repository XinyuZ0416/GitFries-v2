import React from 'react'

export default function NotificationsReplyCard() {
  return (
    <>
    <div className='flex flex-col rounded-lg shadow-sm p-4 gap-2 bg-white hover:bg-gray-100'>
      <h3 className='text-lg font-semibold'>@Bananana replied to your comment on issue "Download YTM Playlist yields to album-artist directory to None, even when the M3U pointing to correct"</h3>
      <p className="font-normal">Update undone</p>
      <div className='border-l-4 pl-3'>
        <p className="font-normal text-gray-400">I don't understand this...</p>
      </div>
      <p className="font-normal">Today</p>
    </div>
    </>
  )
}
