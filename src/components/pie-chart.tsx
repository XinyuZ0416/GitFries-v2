'use client'
import React, { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface GitFriesPieChartProps {
  title: string
}

type PieChartData = {
  key: string,
  value: number
}

export default function GitFriesPieChart({title}: GitFriesPieChartProps) {
  const data: PieChartData[] = [
    { key: "Java", value: 3 },
    { key: "JavaScript", value: 4 },
    { key: "TypeScript", value: 1 },
    { key: "Kotlin", value: 7 },
    { key: "C", value: 6 },
    { key: "C#", value: 3 },
    { key: "Swift", value: 5 },
  ];

  const COLORS: string[] = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1', '#a4de6c', '#d0ed57', '#ffc0cb']

  return (
    <>
    <div className='rounded-lg shadow-sm p-4'>
      <h2 className="text-2xl font-bold">{title}</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart width={730} height={250}>
        <Tooltip />
        <Legend />
        <Pie 
            data={data} 
            dataKey="value" 
            nameKey="key" 
            cx="50%" 
            cy="50%" 
            outerRadius={100} 
          >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
    </>
  )
}
