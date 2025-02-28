'use client'
import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function IssuesContributionsYearlyChart() {
  const data = [
    {
      name: "January",
      issues: 3,
      contributions: 10
    },{
      name: "February",
      issues: 4,
      contributions: 14
    },{
      name: "March",
      issues: 1,
      contributions: 10
    },{
      name: "April",
      issues: 7,
      contributions: 3
    },{
      name: "May",
      issues: 9,
      contributions: 10
    },{
      name: "June",
      issues: 5,
      contributions: 12
    },{
      name: "July",
      issues: 3,
      contributions: 5
    },{
      name: "August",
      issues: 1,
      contributions: 10
    },{
      name: "September",
      issues: 2,
      contributions: 8
    },{
      name: "October",
      issues: 3,
      contributions: 10
    },{
      name: "November",
      issues: 3,
      contributions: 1
    },{
      name: "December",
      issues: 3,
      contributions: 10
    },
  ];

  return (
    <>
    <div>
      <h3>Issues and Contributions This Year</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
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
