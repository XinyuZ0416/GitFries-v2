'use client'
import React, { useState } from 'react'
import Badge from './badge'

export default function AchievementPopover() {
  const [ isShown, setIsShown ] = useState<boolean>(false);
  return (
    <>
    <div className={`${isShown ? 'flex' : 'hidden'} fixed top-0 start-0 z-50 bg-slate-300/50 w-full h-full items-center justify-center`}>
      <div className="relative bg-white p-6 rounded-lg shadow-md max-w-md w-full">
        <div className="flex justify-end">
          <button onClick={(e) => setIsShown(false)} type="button" className="bg-white rounded-md p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
            <span className="sr-only">Close menu</span>
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <h1 className="text-2xl font-bold mb-4 text-center">You unlocked a new achievement!</h1>
        <Badge 
          src='/first-detonation.png' 
          alt='first detonation' 
          title='first detonation' 
          description='Found the bug. Pulled the pin. Walked away in slow motion.' 
          explanation='Posts their first issue' 
        />
      </div>
    </div>

    </>
  )
}
