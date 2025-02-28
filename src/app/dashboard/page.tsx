'use client'
import GitFriesLineChart from '@/components/line-chart'
import GitFriesBarChart from '@/components/bar-chart'
import React from 'react'
import GitFriesPieChart from '@/components/pie-chart'
import EmailSignUp from '@/components/email-signup'

export default function DashboardPage() {
  return (
    <>
    <GitFriesLineChart />
    <div className='flex w-full justify-around'>
      <GitFriesBarChart title={"All Issues This Week"} color={"#FD6216"} />
      <GitFriesPieChart title={"All Issues by Language"} />
      <GitFriesPieChart title={"All Issues by Difficulty"} />
    </div>
    <div className='flex w-full justify-around'>
      <GitFriesBarChart title={"All Contributions This Week"} color={"#32A8FC"} />
      <GitFriesPieChart title={"All Contributions by Language"} />
      <GitFriesPieChart title={"All Contributions by Difficulty"} />
    </div>

    {/* 5th screen */}
    <div className="flex flex-col h-screen justify-center items-center">
      <h1 className="text-4xl font-bold">Sign In or Sign Up to See Your Own Dashboard</h1>
    </div>
    </>
  )
}
