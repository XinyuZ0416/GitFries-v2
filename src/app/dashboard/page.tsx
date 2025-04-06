'use client'
import GitFriesLineChart from '@/components/charts/line'
import GitFriesBarChart from '@/components/charts/bar'
import React, { useEffect, useState } from 'react'
import GitFriesPieChart from '@/components/charts/pie'
import RequireSignInSignUp from '@/components/require-signin-signup'
import { useAuthProvider } from '@/providers/auth-provider'
import { Timestamp, collection, doc, getCountFromServer, getDoc, query, where } from 'firebase/firestore'
import { db } from '../firebase'

type MonthlyIssueContributionType = {
  month: string;
  postedIssues: number;
  claimedIssues: number;
  finishedIssues: number;
};

export default function DashboardPage() {
  const { isVerified, uid } = useAuthProvider();  
  const [ monthlyIssueContributionArr, setMonthlyIssueContributionArr ] = useState<MonthlyIssueContributionType[]>([
    { month: "Jan", postedIssues: 0, claimedIssues: 0, finishedIssues: 0 },
    { month: "Feb", postedIssues: 0, claimedIssues: 0, finishedIssues: 0 },
    { month: "Mar", postedIssues: 0, claimedIssues: 0, finishedIssues: 0 },
    { month: "Apr", postedIssues: 0, claimedIssues: 0, finishedIssues: 0 },
    { month: "May", postedIssues: 0, claimedIssues: 0, finishedIssues: 0 },
    { month: "Jun", postedIssues: 0, claimedIssues: 0, finishedIssues: 0 },
    { month: "Jul", postedIssues: 0, claimedIssues: 0, finishedIssues: 0 },
    { month: "Aug", postedIssues: 0, claimedIssues: 0, finishedIssues: 0 },
    { month: "Sep", postedIssues: 0, claimedIssues: 0, finishedIssues: 0 },
    { month: "Oct", postedIssues: 0, claimedIssues: 0, finishedIssues: 0 },
    { month: "Nov", postedIssues: 0, claimedIssues: 0, finishedIssues: 0 },
    { month: "Dec", postedIssues: 0, claimedIssues: 0, finishedIssues: 0 },
  ]);

  const resolveUserDataField = async(data: string[], collection: string, stats: MonthlyIssueContributionType[], field: 'postedIssues' | 'claimedIssues' | 'finishedIssues') => {
    const promises = data.map(async(id: string) => {
      const docSnap = await getDoc(doc(db, collection, id));
      if (docSnap.exists()) {
        const month = docSnap.data().time.toDate().getMonth(); // 0 - 11
        stats[month][field] += 1;
      }
    });

    await Promise.all(promises);
  }

  const fetchUserData = async() => {
    const userSnap = await getDoc(doc(db, "users", uid));
    const userData = userSnap.data();

    if (userData) {
      const updatedArr = [...monthlyIssueContributionArr]; // Copy current state
      const postedIssues = userData.postedIssues;
      const claimedIssues = userData.claimedIssues;
      const finishedIssues = userData.finishedIssues;

      if (postedIssues.length > 0){
        resolveUserDataField(postedIssues, "issues", updatedArr, "postedIssues");
      }
      if (claimedIssues.length > 0){
        for (let issue of claimedIssues) {
          const month = issue.timestamp.toDate().getMonth(); // 0 - 11
          updatedArr[month].claimedIssues += 1;
        }
      }
      if (finishedIssues.length > 0){
        for (let issue of finishedIssues) {
          const month = issue.timestamp.toDate().getMonth(); // 0 - 11
          updatedArr[month].finishedIssues += 1;
        }
      }
      setMonthlyIssueContributionArr(monthlyIssueContributionArr);
    }
  }
  
  useEffect(() => {   
    if (!uid) return;
    fetchUserData();
  }, [uid]);

  useEffect(() => {
    console.log(monthlyIssueContributionArr);
  }, [monthlyIssueContributionArr]);

  return (
    <>
    <div className='flex flex-col gap-2'>
    {isVerified ? 
      <>
      <GitFriesLineChart title='Issues and Contributions This Year' />
      <div className='flex w-full justify-around'>
        <GitFriesBarChart title="Issues This Week" color="#FD6216" />
        <GitFriesPieChart title="Issues by Language" />
        <GitFriesPieChart title="Issues by Difficulty" />
      </div>
      <div className='flex w-full justify-around'>
        <GitFriesBarChart title="Contributions This Week" color="#32A8FC" />
        <GitFriesPieChart title="Contributions by Language" />
        <GitFriesPieChart title="Contributions by Difficulty" />
      </div>
      </> :
      <RequireSignInSignUp target='View Your Own Dashboard' />
    }
    </div>
    </>
  )
}
