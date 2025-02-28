'use client'
import GitFriesLineChart from '@/components/line-chart'
import GitFriesBarChart from '@/components/bar-chart'
import React from 'react'
import GitFriesPieChart from '@/components/pie-chart'

export default function DashboardPage() {
  return (
    <>
    <GitFriesLineChart />
    <div className='flex w-full justify-around'>
      <GitFriesBarChart title={"Issues This Week"} color={"#FD6216"} />
      <GitFriesPieChart title={"Issues by Language"} />
      <GitFriesPieChart title={"Issues by Difficulty"} />
    </div>
    <div className='flex w-full justify-around'>
      <GitFriesBarChart title={"Contributions This Week"} color={"#32A8FC"} />
      <GitFriesPieChart title={"Contributions by Language"} />
      <GitFriesPieChart title={"Contributions by Difficulty"} />
    </div>
    </>
  )
}
