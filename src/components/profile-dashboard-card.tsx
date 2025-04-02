import React from 'react'
import GitFriesLineChart from './charts/line'

export default function ProfileDashboardCard() {
  return (
    <>
    <div className='flex flex-col w-full justify-center items-center rounded-lg shadow-sm p-4 bg-white'>
      <GitFriesLineChart title='Issues and Contributions This Year' />
      <p className='font-normal underline ml-auto'>More</p>
    </div>
    </>
  )
}
