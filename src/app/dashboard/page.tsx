'use client'
import GitFriesLineChart from '@/components/line-chart'
import GitFriesBarChart from '@/components/bar-chart'
import React from 'react'
import GitFriesPieChart from '@/components/pie-chart'
import RequireSignInSignUp from '@/components/require-signin-signup'
import { useAuth } from '@/components/providers'

export default function DashboardPage() {
  const { isVerified } = useAuth();  
  return (
    <>
    <div className='flex flex-col gap-2'>
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
    {isVerified ? 
      <h2 className="text-2xl font-bold">My Dashboard</h2> :
      <RequireSignInSignUp target='View Your Own Dashboard' />
    }
    </div>
    </>
  )
}
