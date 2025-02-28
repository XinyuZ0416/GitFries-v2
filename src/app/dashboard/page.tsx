import GitFriesLineChart from '@/components/line-chart'
import GitFriesBarChart from '@/components/bar-chart'
import React from 'react'
import GitFriesPieChart from '@/components/pie-chart'

export default function DashboardPage() {
  return (
    <>
    <GitFriesLineChart />
    <GitFriesBarChart />
    <GitFriesPieChart />
    </>
  )
}
