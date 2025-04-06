'use client'
import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface GitFriesLineChartProps {
  title: string,
  data: {
    month: string;
    postedIssues: number;
    claimedIssues: number;
    finishedIssues: number;
  }[]
}

export default function GitFriesLineChart({title, data}: GitFriesLineChartProps) {

  return (
    <>
    <div className='rounded-lg shadow-sm bg-white p-4 w-full'>
      <div className='flex flex-row gap-2 items-center mr-auto'>
        <img className='size-14' src='/contribution.png' alt='contribution' />
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
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
