'use client'
import React from 'react';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

export default function GitFriesBarChart() {
  const data = [
    { name: 'Mon', issues: 4000 },
    { name: 'Tue', issues: 3000 },
    { name: 'Wed', issues: 2000 },
    { name: 'Thu', issues: 2780 },
    { name: 'Fri', issues: 1890 },
    { name: 'Sat', issues: 2390 },
    { name: 'Sun', issues: 3490 },
  ];

  return (
    <>
    <div className='rounded-lg shadow-sm p-4'>
      <h2 className="text-2xl font-bold">Issues This Week</h2>
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data}>
            <XAxis dataKey="name" />
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
