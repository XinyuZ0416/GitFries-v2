'use client'
import React, { useEffect, useState } from 'react'
import ActivitiesIssueCard from './issue'
import ActivitiesCommentCard from './comment'
import { useCurrentUserDocProvider } from '@/providers/current-user-doc-provider'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/app/firebase'
import RequestClaimCard from './request-claim'
import ClaimCard from './claim'
import RequestFinishCard from './request-finish'
import FinishCard from './finish'

export default function ProfileActivities() {
  const { activities } = useCurrentUserDocProvider();
  const [ commentDataMap, setCommentDataMap ] = useState<Record<string, { comment: string; issueTitle: string; issueId: string }>>({});
  const [ requestClaimIssueDataMap, setRequestClaimIssueDataMap ] = useState<Record<string, { issueTitle: string }>>({});
  const [ claimIssueDataMap, setClaimIssueDataMap ] = useState<Record<string, { issueTitle: string }>>({});
  const [ requestFinishIssueDataMap, setRequestFinishIssueDataMap ] = useState<Record<string, { issueTitle: string }>>({});
  const [ finishIssueDataMap, setFinishIssueDataMap ] = useState<Record<string, { issueTitle: string }>>({});

  async function batchFetchDocs<T>(
    ids: string[], 
    collection: string, 
    format: (data: any) => T
  ): Promise<Record<string, T>> {
    // Results should look like this:
    // {
    //  "abc123": { xxx: "...", xxx: "..." },
    // "def456": { xxx: "...", xxx: "..." }
    // }
    const results: Record<string, T> = {};

    await Promise.all(
      ids.map(async (id) => {
        try {
          const snap = await getDoc(doc(db, collection, id));
          if (snap.exists()) {
            results[id] = format(snap.data());
          }
        } catch (err) {
          console.error(`Error fetching comment ${id}:`, err);
        }
      })
    );

    return results;
  }

  useEffect(() => {
    const fetchAllActivities = async () => {
      const commentActivities = activities.filter(a => a.type === 'comment');
      const requestClaimIssueActivities = activities.filter(a => a.type === 'request_claim_issue');
      const claimIssueActivities = activities.filter(a => a.type === 'request_claim_issue_accept');
      const requestFinishIssueActivities = activities.filter(a => a.type === 'request_finish_issue');
      const finishIssueActivities = activities.filter(a => a.type === 'request_finish_issue_accept');

      const [commentData, requestClaimData, claimData, requestFinishData, finishData] = await Promise.all([
        batchFetchDocs(commentActivities.map(a => a.content), "comments", data => ({ // “data” here is from "snap.data()" above in batchFetchDocs()
          comment: data.comment,
          issueId: data.issueId,
          issueTitle: data.issueTitle
        })),

        batchFetchDocs(requestClaimIssueActivities.map(a => a.content), "issues", data => ({
          issueTitle: data.title
        })),

        batchFetchDocs(claimIssueActivities.map(a => a.content), "issues", data => ({
          issueTitle: data.title
        })),

        batchFetchDocs(requestFinishIssueActivities.map(a => a.content), "issues", data => ({
          issueTitle: data.title
        })),

        batchFetchDocs(finishIssueActivities.map(a => a.content), "issues", data => ({
          issueTitle: data.title
        })),
      ]);

      setCommentDataMap(commentData);
      setRequestClaimIssueDataMap(requestClaimData);
      setClaimIssueDataMap(claimData);
      setRequestFinishIssueDataMap(requestFinishData);
      setFinishIssueDataMap(finishData);
    };

    if (activities.length > 0) {
      fetchAllActivities();
    }
  }, [activities]);

  const renderActivitiesCard = () => {
    if (activities.length === 0) return <p>No activities yet</p>;

    return activities
      .slice()
      .sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0))
      .map((activity) => {
        switch (activity.type) {
          case "comment":
            const commentData = commentDataMap[activity.content];
            if (!commentData) return null;
            return (
              <ActivitiesCommentCard
                key={`${activity.type}-${activity.content}-${activity.timestamp}`}
                issueId={commentData.issueId}
                title={commentData.issueTitle}
                content={commentData.comment}
                time={activity.timestamp}
              />
            );
          case "request_claim_issue":
            const requestClaimIssueData = requestClaimIssueDataMap[activity.content];
            if (!requestClaimIssueData) return null;
            return (
              <RequestClaimCard
                key={`${activity.type}-${activity.content}-${activity.timestamp}`}
                issueId={activity.content}
                title={requestClaimIssueData.issueTitle}
                time={activity.timestamp}
              />
            );
          case "request_claim_issue_accept":
            const claimIssueData = claimIssueDataMap[activity.content];
            if (!claimIssueData) return null;
            return (
              <ClaimCard
                key={`${activity.type}-${activity.content}-${activity.timestamp}`}
                issueId={activity.content}
                title={claimIssueData.issueTitle}
                time={activity.timestamp}
              />
            );
          case "request_finish_issue":
            const requestFinishIssueData = requestFinishIssueDataMap[activity.content];
            if (!requestFinishIssueData) return null;
            return (
              <RequestFinishCard
                key={`${activity.type}-${activity.content}-${activity.timestamp}`}
                issueId={activity.content}
                title={requestFinishIssueData.issueTitle}
                time={activity.timestamp}
              />
            );
          case "request_finish_issue_accept":
            const finishIssueData = finishIssueDataMap[activity.content];
            if (!finishIssueData) return null;
            return (
              <FinishCard
                key={`${activity.type}-${activity.content}-${activity.timestamp}`}
                issueId={activity.content}
                title={finishIssueData.issueTitle}
                time={activity.timestamp}
              />
            );
          default:
            return null;
        }
    });
  };
  return (
    <>
    <div className='flex flex-col rounded-lg shadow-sm p-4 bg-white'>
      <div className='flex flex-row gap-2 items-center mr-auto'>
        <img className='size-14' src='/activity.png' alt='activities' />
        <h2 className='text-2xl font-bold'>Activities</h2>
      </div>
      {renderActivitiesCard()}
      {/* <ActivitiesCommentCard />
      <ActivitiesReplyCard />
      <ActivitiesIssueCard /> */}
    </div>
    </>
  )
}
