'use client'
import GitFriesLineChart from '@/components/charts/line'
import GitFriesBarChart from '@/components/charts/bar'
import React, { useEffect, useState } from 'react'
import GitFriesPieChart from '@/components/charts/pie'
import RequireSignInSignUp from '@/components/require-signin-signup'
import { useAuthProvider } from '@/providers/auth-provider'
import { Timestamp, doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'

export default function DashboardPage() {
  const { isVerified, uid } = useAuthProvider();  
  const [ postedIssuesTimeArr, setPostedIssuesTimeArr ] = useState<Timestamp[]>([]);
  const [ claimedIssuesTimeArr, setClaimedIssuesTimeArr ] = useState<Timestamp[]>([]);
  const [ finishedIssuesTimeArr, setFinishedIssuesTimeArr ] = useState<Timestamp[]>([]);

  const fetchUserData = async() => {
    const userSnap = await getDoc(doc(db, "users", uid));
    const userData = userSnap.data();

    if (userData) {
      const postedIssues = userData.postedIssues;
      const claimedIssues = userData.claimedIssues;
      const finishedIssues = userData.finishedIssues;

      if (postedIssues && postedIssues.length > 0){
        let arr: Timestamp[] = [];
        for (let postedIssue of postedIssues) {
          arr.push(postedIssue.timestamp);
        }
        setPostedIssuesTimeArr(arr);
      }
      if (claimedIssues && claimedIssues.length > 0){
        let arr: Timestamp[] = [];
        for (let claimedIssue of claimedIssues) {
          arr.push(claimedIssue.timestamp);
        }
        setClaimedIssuesTimeArr(arr);
      }
      if (finishedIssues && finishedIssues.length > 0){
        let arr: Timestamp[] = [];
        for (let finishedIssue of finishedIssues) {
          arr.push(finishedIssue.timestamp);
        }
        setFinishedIssuesTimeArr(arr);
      }
    }
  }
  
  useEffect(() => {   
    if (!uid) return;
    fetchUserData();
  }, [uid]);

  // useEffect(() => {
  //   console.log(`postedIssuesArr: ${postedIssuesArr}`);
  //   console.log(`claimedIssuesArr: ${claimedIssuesArr}`);
  //   console.log(`finishedIssuesArr: ${finishedIssuesArr}`);
  // }, [postedIssuesArr, claimedIssuesArr, finishedIssuesArr]);

  return (
    <>
    <div className='flex flex-col gap-2'>
    {isVerified ? 
      <>
      <GitFriesLineChart 
        title='Issues and Contributions This Year' 
        postedIssuesTimeArr={postedIssuesTimeArr}
        claimedIssuesTimeArr={claimedIssuesTimeArr}
        finishedIssuesTimeArr={finishedIssuesTimeArr}
      />
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
