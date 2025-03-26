'use client'
import PreviewCard from '@/components/issue-preview';
import { collection, getDocs, query, Timestamp, orderBy, limit, startAfter, getCountFromServer } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react'
import { db } from '../firebase';

type IssueType = {
  issueId: string,
  description: string,
  difficulty: string,
  isUrgent: boolean,
  language: string,
  time: Timestamp,
  title: string,
}

export default function IssuesPage() {
  // TODO: cannot view more than 1 page/ use search without verified log in
  const [ currentPage, setCurrentPage ] = useState<number>(1);
  const lastVisibleIssueRef = useRef<IssueType | null>(null);
  const [ currentPageIssues, setCurrentPageIssues ] = useState<IssueType[]>([])
  const [ allIssuesCount, setAllIssuesCount ] = useState<number>();
  const issuesPerPage = 10;
  const pageNums: number[] = [];

  // Count total amount of issues
  useEffect(() => {
    const countAllIssues = async() => {
      const coll = collection(db, "issues");
      const snapshot = await getCountFromServer(coll);
      setAllIssuesCount(snapshot.data().count);
    }
    countAllIssues();
  }, []);

  // Fetch issues when page changes
  useEffect(() => {
    const fetchIssues = async (page: number = 1) => {
      let issuesQ;

      if (page === 1) {
        issuesQ = query(collection(db, "issues"), orderBy("time", "desc"), limit(issuesPerPage));
      } else {
        issuesQ = query(collection(db, "issues"), orderBy("time", "desc"), startAfter(lastVisibleIssueRef.current!.time), limit(issuesPerPage));
      }

      const issuesQuerySnapshot = await getDocs(issuesQ);
      const fetchedIssues: IssueType[] = await Promise.all(
        issuesQuerySnapshot.docs.map(async (docSnap) => {
          const issueData = docSnap.data();

          return {
            issueId: docSnap.id,
            description: issueData.description,
            difficulty: issueData.difficulty,
            isUrgent: issueData.isUrgent,
            language: issueData.language,
            time: issueData.time,
            title: issueData.title,
            claimedBy: issueData.claimedBy,
          };
        })
      );

      lastVisibleIssueRef.current = fetchedIssues[fetchedIssues.length - 1] || null;
      setCurrentPageIssues(fetchedIssues);
    };

    fetchIssues(currentPage);
  }, [currentPage]);

  // Count total amount of issues and set page numbers
  for (let i = 1; i <= Math.ceil(allIssuesCount! / issuesPerPage); i++) {
    pageNums.push(i);
  }

  const renderPageNum = pageNums.map((num) => {
    return(
      <button key={num} onClick={() => setCurrentPage(num)} className={`px-3 py-1 mx-1 border rounded ${currentPage === num ? 'bg-blue-500 text-white' : ''}`}>
        {num}
      </button>
    )
  });

  return (
    <>
    <div className="flex">
      <div className="flex ml-auto">
        <div className="flex items-center me-4">
          <input id="available" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
          <label htmlFor="available" className="ms-2 text-m font-bold">Available</label>
        </div>
        <div className="flex items-center me-4">
          <input id="language" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
          <label htmlFor="language" className="ms-2 text-m font-bold">Language</label>
        </div>
        <div className="flex items-center me-4">
          <input id="isFavorited" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
          <label htmlFor="isFavorited" className="ms-2 text-m font-bold">Favorited</label>
        </div>
        <div className="flex items-center me-4">
          <input id="isBeginnerFriendly" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
          <label htmlFor="isBeginnerFriendly" className="ms-2 text-m font-bold">Beginner Friendly</label>
        </div>
        <div className="flex items-center me-4">
          <input id="isUrgent" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
          <label htmlFor="isUrgent" className="ms-2 text-m font-bold">Urgent</label>
        </div>
      </div>
    </div>
    
    

    <h2 className="text-2xl font-bold">Latest</h2>

    {/* issue previews */}
    <div className='flex flex-col gap-3 mb-3'>
      {currentPageIssues.map((issue) => (<PreviewCard key={issue.issueId} {...issue} />))}
    </div>
    {/* bottom page nav */}
    <div className='mt-4 flex justify-center'>{renderPageNum}</div>
    </>
  )
}
