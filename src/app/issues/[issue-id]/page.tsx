'use client'
import { db, storage } from '@/app/firebase'
import AddCommentBox from '@/components/add-comment-box'
import IssueCommentCard from '@/components/issue-comment-card'
import formatDate from '@/utils/format-date'
import { Timestamp, doc, getDoc } from 'firebase/firestore'
import { getDownloadURL, ref } from 'firebase/storage'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

type IssueDetailsType = {
  issueId: string,
  title: string,
  description: string,
  time: Timestamp,
  language: string,
  difficulty: string,
  isUrgent: boolean,
  issueReporterUsername: string,
  issueReporterPicUrl: string,
}

export default function IssueDetailsPage() {
  const { "issue-id": issueIdParam } = useParams();
  const issueId = Array.isArray(issueIdParam) ? issueIdParam[0] : issueIdParam; // Ensure only string 
  const [ issueDetails, setIssueDetails ] = useState<IssueDetailsType | null>(null);

  useEffect(() => {
    if(!issueId) return;

    const getIssueDoc = async() => {
      try {
        const issueDocRef = doc(db, "issues", issueId);
        const issueDocSnap = await getDoc(issueDocRef);

        if(!issueDocSnap.data()) return;

        // get issue reporter info
        const userDocRef = doc(db, "users", issueDocSnap.data()!.issueReporterUid);
        const userDocSnap = await getDoc(userDocRef);

        let picUrl = '/potato.png';
        try {
          picUrl = await getDownloadURL(ref(storage, `user-img/${issueDocSnap.data()!.issueReporterUid}`));
        } catch(error: any) {
          if(error.code === "storage/object-not-found") {
            picUrl = '/potato.png';
          } else {
            console.error("Error fetching image:", error.code);
          }
        }

        setIssueDetails({
          issueId: issueId,
          title: issueDocSnap.data()!.title,
          description: issueDocSnap.data()!.description,
          time: issueDocSnap.data()!.time,
          language: issueDocSnap.data()!.language,
          difficulty: issueDocSnap.data()!.difficulty,
          isUrgent: issueDocSnap.data()!.isUrgent,
          issueReporterUsername: userDocSnap.exists() ? userDocSnap.data()!.username : "Unknown",
          issueReporterPicUrl: picUrl,
        })
        console.log(issueDocSnap.data());
      } catch (error) {

      }
      
    }
    getIssueDoc();
  }, [issueId]);

  return (
    <>
    <div className="flex flex-col p-3 m-3 bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className='flex flex-row'>
        <div>
          <img className="rounded-full size-14" src="/potato.png" alt="user profile" />
          <h6 className='text-lg font-bold'>{issueDetails?.issueReporterUsername}</h6>
        </div>

        <div className="flex flex-col justify-between px-4 py-2">
          <h5 className="text-xl font-bold">{issueDetails?.title}</h5>
          
          <div className='flex flex-row gap-2'>
            <p className="font-normal text-gray-700">{formatDate(issueDetails?.time.toDate() as Date)}</p>
            <p className="font-normal text-gray-700">{issueDetails?.language}</p>
            <p className="font-normal text-gray-700">{issueDetails?.difficulty}</p>
            <img className="size-5" src="/link.png" alt="link" />
            <img className="size-5" src="/empty-fries.png" alt="favorite button" />
          </div>
        </div>
      </div>

      <div className='my-3'>
        <p className="font-normal text-gray-700">{issueDetails?.description}</p>
      </div>

      <AddCommentBox />

      <IssueCommentCard />
    </div>
    </>
  )
}
