import React from 'react'

export default function PreviewCard() {
  return (
    <>
    <a href="/issues/1" className="flex flex-row p-3 items-center bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100">
      <div>
        <img className="rounded-full size-14" src="/potato.png" alt="user profile" />
        <h6 className='text-lg font-bold'>Potato</h6>
      </div>

      <div className="flex flex-col justify-between px-4 py-2">
        <h5 className="text-xl font-bold">Download YTM Playlist yields to album-artist directory to None, even when the M3U pointing to correct</h5>
        <p className="font-normal text-gray-700">When outputting downloaded file in it should create directory with correct name according to music metadata. Instead, it creates  None directory for all downloaded music from one YTM Playlist.</p>
      </div>

      <div>
        <p className="font-normal text-gray-700">Today</p>
        <p className="font-normal text-gray-700">Kotlin</p>
      </div>
    </a>
    </>
  )
}
