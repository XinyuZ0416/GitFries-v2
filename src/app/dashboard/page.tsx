import IssuesContributionsYearlyChart from '@/components/issues-contributions-yearly-chart'
import IssuesWeeklyChart from '@/components/issues-weekly-chart'
import React from 'react'

export default function DashboardPage() {
  return (
    <>
    <IssuesContributionsYearlyChart />
    <IssuesWeeklyChart />
    </>
  )
}
