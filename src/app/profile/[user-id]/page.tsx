'use client'
import ProfileAchievementsCard from '@/components/profile/achievements'
import ProfileActivities from '@/components/profile/activities/activities'
import ProfileDashboardCard from '@/components/profile/dashboard'
import ProfilePicCard from '@/components/profile/bio'
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useAuthProvider } from '@/providers/auth-provider'
import { doc, getDoc } from 'firebase/firestore'
import { db, storage } from '@/app/firebase'
import { getDownloadURL, ref } from 'firebase/storage'

export default function ProfilePage() {
  const { "user-id": userIdParam } = useParams();
  const userId = Array.isArray(userIdParam) ? userIdParam[0] : userIdParam; // Ensure only string 
  const { username, bio, uid, userPicUrl } = useAuthProvider();
  const [ displayUsername, setDisplayUsername ] = useState<string>("");
  const [ displayBio, setDisplayBio ] = useState<string>("");
  const [ displayUserPicUrl, setDisplayUserPicUrl ] = useState<string>("");

  const getUserInfo = async() => {
    if (userId === uid) {
      setDisplayUsername(username);
      setDisplayBio(bio);
      setDisplayUserPicUrl(userPicUrl);
    } else {
      const userDocSnap = await getDoc(doc(db, "users", userId!));
      const userData = userDocSnap.data();
      if (userData) {
        setDisplayUsername(userData.username);
        setDisplayBio(userData.bio);
        try {
          const url = await getDownloadURL(ref(storage, `user-img/${userId}`));
          setDisplayUserPicUrl(url);
        } catch {
          setDisplayUserPicUrl("/potato.png");
        }
      }
    }
  }
  // TODO: if no user/ user not verified, dont show content
  useEffect(() => {
    getUserInfo();
  }, [displayUsername, displayBio, displayUserPicUrl]);
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
        <ProfileDashboardCard />
      </div>
      <ProfileActivities />
    </div>
    </>
  )
}
