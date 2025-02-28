'use client'
import React from 'react';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

export default function GitFriesBarChart() {
  type BarChartData = {
    day: string,
    issues: number
  }

  const data: BarChartData[] = [
    { day: 'Mon', issues: 4000 },
    { day: 'Tue', issues: 3000 },
    { day: 'Wed', issues: 2000 },
    { day: 'Thu', issues: 2780 },
    { day: 'Fri', issues: 1890 },
    { day: 'Sat', issues: 2390 },
    { day: 'Sun', issues: 3490 },
  ];

  return (
    <>
    <div className='rounded-lg shadow-sm p-4'>
      <h2 className="text-2xl font-bold">Issues This Week</h2>
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="issues" fill="#FD6216" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
    </>
  );
}
