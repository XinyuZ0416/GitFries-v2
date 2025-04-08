'use client'
import ProfileAchievementsCard from '@/components/profile/achievements'
import ProfileActivities from '@/components/profile/activities/activities'
import ProfileDashboardCard from '@/components/profile/dashboard'
import ProfilePicCard from '@/components/profile/bio'
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useAuthProvider } from '@/providers/auth-provider'
import { Timestamp, doc, getDoc } from 'firebase/firestore'
import { db, storage } from '@/app/firebase'
import { getDownloadURL, ref } from 'firebase/storage'
import { useCurrentUserDocProvider } from '@/providers/current-user-doc-provider'

interface ChartDataItem {
  month: string;
  postedIssues: number;
  claimedIssues: number;
  finishedIssues: number;
}

interface ActivityType {
  content: string;
  type: string;
  timestamp: Timestamp;
}

export default function ProfilePage() {
  // For ProfilePicCard
  const { "user-id": userIdParam } = useParams();
  const userId = Array.isArray(userIdParam) ? userIdParam[0] : userIdParam; // Ensure only string 
  const { username, bio, uid, userPicUrl } = useAuthProvider();
  const [ displayUsername, setDisplayUsername ] = useState<string>("");
  const [ displayBio, setDisplayBio ] = useState<string>("");
  const [ displayUserPicUrl, setDisplayUserPicUrl ] = useState<string>("/potato.png");
  // For ProfileDashboardCard
  const [ postedIssuesTimeArr, setPostedIssuesTimeArr ] = useState<Timestamp[]>([]);
  const [ claimedIssuesTimeArr, setClaimedIssuesTimeArr ] = useState<Timestamp[]>([]);
  const [ finishedIssuesTimeArr, setFinishedIssuesTimeArr ] = useState<Timestamp[]>([]);
  const [combinedData, setCombinedData] = useState<ChartDataItem[]>([]);
  const monthNames = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];
  // For ProfileActivities
  const { activities } = useCurrentUserDocProvider();
  const [ displayActivities, setDisplayActivities ] = useState<ActivityType[]>([]);
  
  const countEventsByMonth = (timestamps: Timestamp[]) => {
    const counts = Array(12).fill(0);
    timestamps?.forEach(time => {
      if (time?.toDate) {
        const monthIndex = time.toDate().getMonth();
        counts[monthIndex]++;
      }
    });
    return counts;
  }

  const fetchUserData = async() => {
    if (userId === uid) {
      setDisplayUsername(username);
      setDisplayBio(bio);
      setDisplayUserPicUrl(userPicUrl);
      setDisplayActivities(activities);
    } else {
      const userDocSnap = await getDoc(doc(db, "users", userId!));
      const userData = userDocSnap.data();
      if (userData) {
        // For ProfilePicCard
        setDisplayUsername(userData.username);
        setDisplayBio(userData.bio);
        try {
          const url = await getDownloadURL(ref(storage, `user-img/${userId}`));
          setDisplayUserPicUrl(url);
        } catch {
          setDisplayUserPicUrl("/potato.png");
        }

        // For ProfileActivities
        setDisplayActivities(userData.activities ?? []);

        // For ProfileDashboardCard
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
  }

  // TODO: if no user/ user not verified, dont show content
  useEffect(() => {
    fetchUserData();
  }, [displayUsername, displayBio, displayUserPicUrl]);

  // Populate data for chart
  useEffect(() => {
    const postedIssuesCounts = countEventsByMonth(postedIssuesTimeArr);
    const claimedIssuesCounts = countEventsByMonth(claimedIssuesTimeArr);
    const finishedIssuesCounts = countEventsByMonth(finishedIssuesTimeArr);

    // Prepare data in chart-required format
    const transformedData = monthNames.map((month, index) => ({
      month,
      postedIssues: postedIssuesCounts[index],
      claimedIssues: claimedIssuesCounts[index],
      finishedIssues: finishedIssuesCounts[index]
    }));

    setCombinedData(transformedData);
  }, [postedIssuesTimeArr, claimedIssuesTimeArr, finishedIssuesTimeArr]); 

  return (
    <>
    <div className='flex flex-col gap-2'>
      <div className='flex flex-row gap-2 w-full'>
        <div className='flex flex-col gap-2 w-fit justify-between'>
          <ProfilePicCard 
            username={displayUsername}
            bio={displayBio}
            userPicUrl={displayUserPicUrl}
          />
          <ProfileAchievementsCard />
        </div>
        <ProfileDashboardCard combinedData={combinedData} />
      </div>
      <ProfileActivities displayActivities={displayActivities} />
    </div>
    </>
  )
}
