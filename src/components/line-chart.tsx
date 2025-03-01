'use client'
import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface GitFriesLineChartProps {
  title: string,
}

type LineChartData = {
  month: string,
  issues: number,
  contributions: number
}

export default function GitFriesLineChart({title}: GitFriesLineChartProps) {
  const data: LineChartData[] = [
    {
      month: "Jan",
      issues: 3,
      contributions: 10
    },{
      month: "Feb",
      issues: 4,
      contributions: 14
    },{
      month: "Mar",
      issues: 1,
      contributions: 10
    },{
      month: "Apr",
      issues: 7,
      contributions: 3
    },{
      month: "May",
      issues: 9,
      contributions: 10
    },{
      month: "Jun",
      issues: 5,
      contributions: 12
    },{
      month: "Jul",
      issues: 3,
      contributions: 5
    },{
      month: "Aug",
      issues: 1,
      contributions: 10
    },{
      month: "Sep",
      issues: 2,
      contributions: 8
    },{
      month: "Oct",
      issues: 3,
      contributions: 10
    },{
      month: "Nov",
      issues: 3,
      contributions: 1
    },{
      month: "Dec",
      issues: 3,
      contributions: 10
    },
  ];

  return (
    <>
    <div className='rounded-lg shadow-sm p-4 w-full'>
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
          <Line type="monotone" dataKey="issues" stroke="#FD6216" />
          <Line type="monotone" dataKey="contributions" stroke="#32A8FC" />
        </LineChart>
    </ResponsiveContainer>
    </div>
    </>
  )
}
