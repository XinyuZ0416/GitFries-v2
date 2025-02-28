'use client'
import React from 'react';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

export default function IssuesWeeklyChart() {
  const data = [
    { name: 'January', issues: 4000 },
    { name: 'February', issues: 3000 },
    { name: 'March', issues: 2000 },
    { name: 'Aoril', issues: 2780 },
    { name: 'May', issues: 1890 },
    { name: 'June', issues: 2390 },
    { name: 'July', issues: 3490 },
    { name: 'August', issues: 2011 },
    { name: 'September', issues: 2345 },
    { name: 'October', issues: 3490 },
    { name: 'November', issues: 1034 },
    { name: 'December', issues: 3490 }
  ];

  return (
    <div className="w-full h-64 rounded-lg shadow-sm p-4">
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="issues" fill="#FD6216" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
