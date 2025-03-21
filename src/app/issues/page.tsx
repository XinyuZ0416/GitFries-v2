'use client'
import LanguageCarousel from '@/components/language-carousel'
import PreviewCard from '@/components/issue-preview';
import { collection, getDoc, doc, getDocs, query, where, Timestamp, orderBy, limit, startAfter } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { db, storage } from '../firebase';

type IssueType = {
  issueId: string,
  description: string,
  difficulty: string,
  isUrgent: boolean,
  language: string,
  time: Timestamp,
  title: string,
  issueReporterUid: string,
  issueReporterUsername: string,
}

type IssueReporterType = {
  issueId: string,
  issueReporterUid: string,
  issueReporterUsername: string,
}

export default function IssuesPage() {
  // TODO: cannot view more than 1 page/ use search without verified log in
  const [ currentPage, setCurrentPage ] = useState<number>(1);
  const [ lastVisibleIssue, setLastVisibleIssue ] = useState<IssueType | null>(null);
  const [ currentPageIssues, setCurrentPageIssues ] = useState<IssueType[]>([])
  const issuesPerPage = 10;
  const [ currentPageIssueReporters, setCurrentPageIssueReporters ] = useState<IssueReporterType[]>([])

  // Fetch issues when page changes
  useEffect(() => {
    const fetchIssuesWithUsersOnCurrentPage = async(currentPage: number = 1) => {
      let issuesQ;
      
      if (currentPage === 1) { // First page
        issuesQ = query(collection(db, "issues"), orderBy("time", "desc"), limit(issuesPerPage));
      } else { // Other pages
        issuesQ = query(collection(db, "issues"), orderBy("time", "desc"), startAfter(lastVisibleIssue), limit(issuesPerPage));
      }
  
      const issuesQuerySnapshot = await getDocs(issuesQ);
      const fetchedIssues: IssueType[] = issuesQuerySnapshot.docs.map((doc) => ({
        ...doc.data(),
        issueId: doc.id,
      }) as IssueType);
      
      setLastVisibleIssue(fetchedIssues[fetchedIssues.length - 1] || null);
      setCurrentPageIssues(fetchedIssues);

      const fetchedIssueReporters: IssueReporterType[] = await Promise.all(
        fetchedIssues.map(async(issue) => {
          // Get user other info
          const userDocRef = doc(db, "users", issue.issueReporterUid);
          const userDocSnap = await getDoc(userDocRef);
          
          return {
            issueId: issue.issueId,
            issueReporterUid: issue.issueReporterUid,
            issueReporterUsername: userDocSnap.exists() ? userDocSnap.data()!.username : "Unknown",
          }
        })
      );
      setCurrentPageIssueReporters(fetchedIssueReporters);
    }

    fetchIssuesWithUsersOnCurrentPage(currentPage);
    
  }, [currentPage]);

  return (
    <>
    <div className="flex">
      <div>
        <h2 className="text-2xl font-bold">Languages</h2>
      </div>
      <div className="flex ml-auto">
      <div className="flex items-center me-4">
          <input id="inline-checkbox" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
          <label htmlFor="inline-checkbox" className="ms-2 text-m font-bold">Favorited</label>
        </div>
        <div className="flex items-center me-4">
          <input id="inline-checkbox" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
          <label htmlFor="inline-checkbox" className="ms-2 text-m font-bold">Beginner Friendly</label>
        </div>
        <div className="flex items-center me-4">
          <input id="inline-2-checkbox" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
          <label htmlFor="inline-2-checkbox" className="ms-2 text-m font-bold">Urgent</label>
        </div>
      </div>
    </div>
    
    <LanguageCarousel />

    <h2 className="text-2xl font-bold">Latest</h2>

    {/* issue previews */}
    <div className='flex flex-col gap-3 mb-3'>
      {currentPageIssues.map((issue) => (<PreviewCard key={issue.issueId} {...issue} />))}
    </div>
    {/* bottom page nav */}
    {/* <div className='mt-4 flex justify-center'>{renderPageNum}</div> */}
    </>
  )
}
