import React from 'react'
import ActivitiesReplyCard from './reply'
import ActivitiesIssueCard from './issue'
import ActivitiesCommentCard from './comment'

export default function ProfileActivitiesCard() {
  return (
    <>
    <div className='flex flex-col rounded-lg shadow-sm p-4 bg-white'>
      <div className='flex flex-row gap-2 items-center mr-auto'>
        <img className='size-14' src='/activity.png' alt='activities' />
        <h2 className='text-2xl font-bold'>Activities</h2>
      </div>
      <ActivitiesCommentCard />
      <ActivitiesReplyCard />
      <ActivitiesIssueCard />
    </div>
    </>
  )
}
