'use client'
import React, { useEffect, useState } from 'react'
import GitFriesLineChart from '../charts/line'
import { useAuthProvider } from '@/providers/auth-provider';
import { Timestamp, doc, getDoc } from 'firebase/firestore';
import { db } from '@/app/firebase';

export default function ProfileDashboardCard() {
  const { uid } = useAuthProvider();  
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

  return (
    <>
    <div className='flex flex-col w-full justify-center items-center rounded-lg shadow-sm p-4 bg-white'>
      <GitFriesLineChart 
        title='Issues and Contributions This Year' 
        postedIssuesTimeArr={postedIssuesTimeArr}
        claimedIssuesTimeArr={claimedIssuesTimeArr}
        finishedIssuesTimeArr={finishedIssuesTimeArr}
      />
      <p className='font-normal underline ml-auto'>More</p>
    </div>
    </>
  )
}
