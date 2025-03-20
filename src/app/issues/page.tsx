'use client'
import LanguageCarousel from '@/components/language-carousel'
import PreviewCard from '@/components/preview-card';
import { collection, getDoc, doc, getDocs, query, where, Timestamp } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { db, storage } from '../firebase';
import { getDownloadURL, ref } from 'firebase/storage';

type IssueType = {
  issueId: string,
  description: string,
  difficulty: string,
  isUrgent: boolean,
  language: string,
  time: Timestamp,
  title: string,
  issueReporterUsername: string,
  issueReporterPicUrl: string,
}

export default function IssuesPage() {
  // TODO: cannot view more than 1 page/ use search without verified log in
  const [ currentPage, setCurrentPage ] = useState<number>(1);
  const [ issuesPerPage, setIssuesPerPage] = useState<number>(10);
  const [ allIssues, setAllIssues ] = useState<IssueType[]>([])

  const totalIssuesCount: number = 50; // TODO: (IF PROJECT SCALES) improve performance: guessing the amount, then increase if not enough (see obsidian notes)
  const currentPageLastIssueIndex: number  = currentPage * issuesPerPage;
  const currentPageFirstIssueIndex: number  = currentPageLastIssueIndex - issuesPerPage;
  const currentPageIssues: IssueType[] = allIssues.slice(currentPageFirstIssueIndex, currentPageLastIssueIndex);
  
  const pageNums: number[] = [];
  // TODO: use 1, 2, 3, 4, 5, ..., 16, 17, 18, 19, 20
  for (let i = 1; i <= Math.ceil(totalIssuesCount / issuesPerPage); i++) { 
    pageNums.push(i);
  }

  const renderPageNum = pageNums.map((num) => {
    return(
      <button key={num} onClick={() => setCurrentPage(num)} className={`px-3 py-1 mx-1 border rounded ${currentPage === num ? 'bg-blue-500 text-white' : ''}`}>
        {num}
      </button>
    );
  });

  useEffect(() => {

    const getAllIssues = async() => {
      const issuesQ = query(collection(db, "issues"));
      const issuesQuerySnapshot = await getDocs(issuesQ);

      const fetchedIssues: IssueType[] = await Promise.all(
        issuesQuerySnapshot.docs.map(async (document) => {
          // get issue reporter info
          const userDocRef = doc(db, "users", document.data().issueReporterUid);
          const userDocSnap = await getDoc(userDocRef);
          
          let picUrl = '/potato.png';
          try {
            picUrl = await getDownloadURL(ref(storage, `user-img/${document.data().issueReporterUid}`));
          } catch(error: any) {
            if(error.code === "storage/object-not-found") {
              picUrl = '/potato.png';
            } else {
              console.error("Error fetching image:", error.code);
            }
          }
 
          return {
            issueId: document.id,
            description: document.data().description,
            difficulty: document.data().difficulty,
            isUrgent: document.data().isUrgent,
            language: document.data().language,
            time: document.data().time,
            title: document.data().title,
            issueReporterUsername: userDocSnap.exists() ? userDocSnap.data()!.username : "Unknown",
            issueReporterPicUrl: picUrl,
          };
        })
      );


      setAllIssues(fetchedIssues);
      console.log(fetchedIssues)
    }

    getAllIssues();
  }, []);

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
    <div className='mt-4 flex justify-center'>{renderPageNum}</div>
    </>
  )
}
