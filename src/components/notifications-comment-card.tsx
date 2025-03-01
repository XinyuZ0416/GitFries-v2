import React from 'react'

export default function NotificationsCommentCard() {
  return (
    <>
    <div className='flex flex-col rounded-lg shadow-sm p-4 gap-2 bg-white hover:bg-gray-100'>
      <h3 className='text-lg font-semibold'>@Banana commented on your issue "Download YTM Playlist yields to album-artist directory to None, even when the M3U pointing to correct"</h3>
      <p className="font-normal">Hard project!</p>
      <div className='border-l-4 pl-3'>
        <p className="font-normal text-gray-400">When outputting downloaded file in it should create directory with correct name according to music metadata. Instead, it creates None directory for all downloaded music from one YTM Playlist.</p>
      </div>
      <p className="font-normal">Today</p>
    </div>
    </>
  )
}
