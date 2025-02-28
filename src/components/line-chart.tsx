'use client'
import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function GitFriesLineChart() {
  type LineChartData = {
    month: string,
    issues: number,
    contributions: number
  }

  const data: LineChartData[] = [
    {
      month: "January",
      issues: 3,
      contributions: 10
    },{
      month: "February",
      issues: 4,
      contributions: 14
    },{
      month: "March",
      issues: 1,
      contributions: 10
    },{
      month: "April",
      issues: 7,
      contributions: 3
    },{
      month: "May",
      issues: 9,
      contributions: 10
    },{
      month: "June",
      issues: 5,
      contributions: 12
    },{
      month: "July",
      issues: 3,
      contributions: 5
    },{
      month: "August",
      issues: 1,
      contributions: 10
    },{
      month: "September",
      issues: 2,
      contributions: 8
    },{
      month: "October",
      issues: 3,
      contributions: 10
    },{
      month: "November",
      issues: 3,
      contributions: 1
    },{
      month: "December",
      issues: 3,
      contributions: 10
    },
  ];

  return (
    <>
    <div className='rounded-lg shadow-sm p-4'>
      <h2 className="text-2xl font-bold">Issues and Contributions This Year</h2>
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
