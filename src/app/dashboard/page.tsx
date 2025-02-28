import GitFriesLineChart from '@/components/line-chart'
import GitFriesBarChart from '@/components/bar-chart'
import React from 'react'
import GitFriesPieChart from '@/components/pie-chart'

export default function DashboardPage() {
  return (
    <>
    <GitFriesLineChart />
    <div className='flex w-full justify-around'>
      <GitFriesBarChart />
      <GitFriesPieChart />
      <GitFriesPieChart />
    </div>
    <div className='flex w-full justify-around'>
      <GitFriesBarChart />
      <GitFriesPieChart />
      <GitFriesPieChart />
    </div>
    </>
  )
}
