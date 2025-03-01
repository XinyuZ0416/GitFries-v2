'use client'
import GitFriesLineChart from '@/components/line-chart'
import GitFriesBarChart from '@/components/bar-chart'
import React from 'react'
import GitFriesPieChart from '@/components/pie-chart'
import RequireSignInSignUp from '@/components/require-signin-signup'

export default function DashboardPage() {
  return (
    <>
    <GitFriesLineChart title='All Issues and Contributions This Year' />
    <div className='flex w-full justify-around'>
      <GitFriesBarChart title="All Issues This Week" color="#FD6216" />
      <GitFriesPieChart title="All Issues by Language" />
      <GitFriesPieChart title="All Issues by Difficulty" />
    </div>
    <div className='flex w-full justify-around'>
      <GitFriesBarChart title="All Contributions This Week" color="#32A8FC" />
      <GitFriesPieChart title="All Contributions by Language" />
      <GitFriesPieChart title="All Contributions by Difficulty" />
    </div>

    <RequireSignInSignUp target='View Your Own Dashboard' />
    </>
  )
}
