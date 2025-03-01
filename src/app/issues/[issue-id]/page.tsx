import AddCommentBox from '@/components/add-comment-box'
import IssueCommentCard from '@/components/issue-comment-card'
import React from 'react'

export default function IssueDetailsPage() {
  return (
    <>
    <div className="flex flex-col p-3 m-3 bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className='flex flex-row'>
        <div>
          <img className="rounded-full size-14" src="/potato.png" alt="user profile" />
          <h6 className='text-lg font-bold'>Potato</h6>
        </div>

        <div className="flex flex-col justify-between px-4 py-2">
          <h5 className="text-xl font-bold">Download YTM Playlist yields to album-artist directory to None, even when the M3U pointing to correct</h5>
          
          <div className='flex flex-row gap-2'>
            <p className="font-normal text-gray-700">Today</p>
            <p className="font-normal text-gray-700">Kotlin</p>
            <img className="size-5" src="/link.png" alt="link" />
            <img className="size-5" src="/empty-fries.png" alt="favorite button" />
          </div>
        </div>
      </div>

      <div className='my-3'>
        <p className="font-normal text-gray-700">When outputting downloaded file in it should create directory with correct name according to music metadata. Instead, it creates  None directory for all downloaded music from one YTM Playlist.</p>
      </div>

      <AddCommentBox />

      <IssueCommentCard />
    </div>
    </>
  )
}
