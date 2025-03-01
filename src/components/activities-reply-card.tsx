import React from 'react'

export default function ActivitiesReplyCard() {
  return (
    <>
    <div className='flex flex-col rounded-lg shadow-sm p-4 gap-2 bg-white'>
      <h3 className='text-lg font-semibold mt-2 '>Replied @Bananana</h3>
      <p className="font-normal">I don't understand this...</p>
      <div className='border-l-4 pl-3'>
        <p className="font-normal text-gray-400">Banana: Update undone</p>
      </div>
      <p className="font-normal">Today</p>
    </div>
    </>
  )
}
