'use client'
import { Timestamp } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface GitFriesLineChartProps {
  title: string,
  postedIssuesTimeArr: Timestamp[],
  claimedIssuesTimeArr: Timestamp[],
  finishedIssuesTimeArr: Timestamp[],
}

interface ChartDataItem {
  month: string;
  postedIssues: number;
  claimedIssues: number;
  finishedIssues: number;
}

export default function GitFriesLineChart({
  title, 
  postedIssuesTimeArr,
  claimedIssuesTimeArr,
  finishedIssuesTimeArr
}: GitFriesLineChartProps) {
  const [combinedData, setCombinedData] = useState<ChartDataItem[]>([]);
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ]
  const countEventsByMonth = (timestamps: Timestamp[]) => {
    const counts = Array(12).fill(0);
    timestamps?.forEach(time => {
      if (time?.toDate) {
        const monthIndex = time.toDate().getMonth();
        counts[monthIndex]++;
      }
    });
    return counts;
  }

  useEffect(() => {
    const postedIssuesCounts = countEventsByMonth(postedIssuesTimeArr);
    const claimedIssuesCounts = countEventsByMonth(claimedIssuesTimeArr);
    const finishedIssuesCounts = countEventsByMonth(finishedIssuesTimeArr);

    // Prepare data in chart-required format
    const transformedData = monthNames.map((month, index) => ({
      month,
      postedIssues: postedIssuesCounts[index],
      claimedIssues: claimedIssuesCounts[index],
      finishedIssues: finishedIssuesCounts[index]
    }));

    setCombinedData(transformedData);
  }, [postedIssuesTimeArr, claimedIssuesTimeArr, finishedIssuesTimeArr]); 

  return (
    <>
    <div className='rounded-lg shadow-sm bg-white p-4 w-full'>
      <div className='flex flex-row gap-2 items-center mr-auto'>
        <img className='size-14' src='/contribution.png' alt='contribution' />
        <h2 className="text-2xl font-bold">{title}</h2>
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
