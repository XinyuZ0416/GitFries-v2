'use client'
import LanguageCarousel from '@/components/language-carousel'
import PreviewCard from '@/components/preview-card';
import React, { useState } from 'react'

type IssueType = {
  issueId: string,
  description: string,
  difficulty: string,
  isUrgent: boolean,
  issueReporterUid: string,
  language: string,
  time: Date,
  title: string,
  url: string,
}

export default function IssuesPage() {
  // TODO: cannot view more than 1 page/ use search without verified log in
  const [ currentPage, setCurrentPage ] = useState<number>(1);
  const [ issuesPerPage, setIssuesPerPage] = useState<number>(10);

  const allIssues: IssueType[] = [
    { 
      issueId: 'cVEFte2kA4i3mQEblc5e',
      description: 'description',
      difficulty: 'difficulty',
      isUrgent: true,
      issueReporterUid: 'jP0ygLVFw9TELMIFTIkfkJSal4j1',
      language: 'c',
      time: new Date(),
      title: 'a',
      url: 'https://www.baidu.com/',
    }
  ]
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

    <div className='flex flex-col gap-3 mb-3'>
      {currentPageIssues.map((issue) => (<PreviewCard key={issue.issueId} {...issue} />))}
    </div>

    <div className='mt-4 flex justify-center'>{renderPageNum}</div>
    </>
  )
}
