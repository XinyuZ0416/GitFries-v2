'use client'
import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface ChartDataItem {
  month: string;
  postedIssues: number;
  claimedIssues: number;
  finishedIssues: number;
}

interface ProfileDashboardCardProps {
  combinedData: ChartDataItem[]
}

export default function ProfileDashboardCard({ combinedData }: ProfileDashboardCardProps) {
 
  return (
    <>
      <div className='border-2 border-black shadow-[4px_4px_0px_0px_black] rounded-lg bg-white p-4 w-full'>
      <div className='flex flex-row gap-2 items-center mr-auto'>
        <img className='size-14' src='/contribution.png' alt='contribution' />
        <h2 className="text-2xl font-bold">Issues and Contributions This Year</h2>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={combinedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="postedIssues" stroke="#FD6216" />
          <Line type="monotone" dataKey="claimedIssues" stroke="#32A8FC" />
          <Line type="monotone" dataKey="finishedIssues" stroke="#32A822" />
        </LineChart>
    </ResponsiveContainer>
    </div>
    </>
  )
}
