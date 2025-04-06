'use client'
import { db } from '@/app/firebase';
import { Timestamp, doc, getDoc } from 'firebase/firestore';
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

  useEffect(() => {
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ]

    if (postedIssuesTimeArr.length > 0 || claimedIssuesTimeArr.length > 0 || finishedIssuesTimeArr.length > 0 ) {
      const populateChart = () => {
        const postedIssuesCounts = Array(12).fill(0);
        const claimedIssuesCounts = Array(12).fill(0);
        const finishedIssuesCounts = Array(12).fill(0);

        postedIssuesTimeArr.forEach(time => {
          const monthIndex = time.toDate().getMonth();
          postedIssuesCounts[monthIndex]++;
        });

        claimedIssuesTimeArr.forEach(time => {
          const monthIndex = time.toDate().getMonth();
          claimedIssuesCounts[monthIndex]++;
        });

        finishedIssuesTimeArr.forEach(time => {
          const monthIndex = time.toDate().getMonth();
          finishedIssuesCounts[monthIndex]++;
        });

        // Prepare data in chart-required format
        const transformedData = monthNames.map((month, index) => ({
          month,
          postedIssues: postedIssuesCounts[index],
          claimedIssues: claimedIssuesCounts[index],
          finishedIssues: finishedIssuesCounts[index]
        }));

        setCombinedData(transformedData);
      };

      populateChart();
    } else {
      setCombinedData([]);
    }
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
