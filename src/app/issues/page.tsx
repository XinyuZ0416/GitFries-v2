'use client'
import LanguageCarousel from '@/components/language-carousel'
import PreviewCard from '@/components/issue-preview';
import { collection, getDoc, doc, getDocs, query, where, Timestamp, orderBy, limit, startAfter } from 'firebase/firestore';
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
  const [ lastVisibleIssue, setLastVisibleIssue ] = useState<IssueType | null>(null);
  const [ currentPageIssues, setCurrentPageIssues ] = useState<IssueType[]>([])
  const issuesPerPage = 10;


  useEffect(() => {
    const fetchIssuesOnCurrentPage = async(currentPage: number = 1) => {
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
      
      setLastVisibleIssue(fetchedIssues[fetchedIssues.length - 1]);
      setCurrentPageIssues(fetchedIssues);
    }

    fetchIssuesOnCurrentPage(currentPage);
    

    // const getAllIssues = async() => {
    //   const issuesQ = query(collection(db, "issues"), orderBy("time", "desc"));
    //   const issuesQuerySnapshot = await getDocs(issuesQ);

    //   const fetchedIssues: IssueType[] = await Promise.all(
    //     issuesQuerySnapshot.docs.map(async (document) => {
    //       // get issue reporter info
    //       const userDocRef = doc(db, "users", document.data().issueReporterUid);
    //       const userDocSnap = await getDoc(userDocRef);
          
    //       let picUrl = '/potato.png';
    //       try {
    //         picUrl = await getDownloadURL(ref(storage, `user-img/${document.data().issueReporterUid}`));
    //       } catch(error: any) {
    //         if(error.code === "storage/object-not-found") {
    //           picUrl = '/potato.png';
    //         } else {
    //           console.error("Error fetching image:", error.code);
    //         }
    //       }
 
    //       return {
    //         issueId: document.id,
    //         description: document.data().description,
    //         difficulty: document.data().difficulty,
    //         isUrgent: document.data().isUrgent,
    //         language: document.data().language,
    //         time: document.data().time,
    //         title: document.data().title,
    //         issueReporterUsername: userDocSnap.exists() ? userDocSnap.data()!.username : "Unknown",
    //         issueReporterPicUrl: picUrl,
    //       };
    //     })
    //   );


    //   setAllIssues(fetchedIssues);
    //   console.log(fetchedIssues)
    // }

    // getAllIssues();
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
      {/* {currentPageIssues.map((issue) => (<PreviewCard key={issue.issueId} {...issue} />))} */}
    </div>
    {/* bottom page nav */}
    {/* <div className='mt-4 flex justify-center'>{renderPageNum}</div> */}
    </>
  )
}
