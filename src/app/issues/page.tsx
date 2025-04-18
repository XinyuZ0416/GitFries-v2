'use client'
import PreviewCard from '@/components/issue-preview';
import { collection, getDocs, query, Timestamp, orderBy, limit, startAfter, getCountFromServer, where } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react'
import { db } from '../firebase';
import { useAuthProvider } from '@/providers/auth-provider';

type IssueType = {
  issueId: string,
  description: string,
  difficulty: string,
  isUrgent: boolean,
  language: string,
  time: Timestamp,
  title: string,
  claimedBy?: string,
  finishedBy?: string,
}

type FormDataType = {
  isClaimedByMe: boolean,
  isFinishedByMe: boolean,
  isAvailable: boolean,
  isFavorited: boolean,
  isEasyFix: boolean,
  isUrgent: boolean,
  language: string,
}

export default function IssuesPage() {
  // TODO: cannot view more than 1 page/ use search without verified log in
  const { uid } = useAuthProvider();
  const [ isLoading, setIsLoading ] = useState<boolean>(false);
  const [ isFiltering, setIsFiltering ] = useState<boolean>(false);
  const [ filteredIssues, setFilteredIssues ] = useState<IssueType[]>([]);
  const [ currentPage, setCurrentPage ] = useState<number>(1);
  const lastVisibleIssueRef = useRef<IssueType | null>(null);
  const [ currentPageIssues, setCurrentPageIssues ] = useState<IssueType[]>([])
  const [ allIssuesCount, setAllIssuesCount ] = useState<number>();
  const issuesPerPage = 10;
  const pageNums: number[] = [];
  
  const [ formData, setFormData ] = useState<FormDataType>({
    isClaimedByMe: false,
    isFinishedByMe: false,
    isAvailable: false,
    isFavorited: false,
    isEasyFix: false,
    isUrgent: false,
    language: 'Select',
  });

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
            finishedBy: issueData.finishedBy,
          };
        })
      );

      lastVisibleIssueRef.current = fetchedIssues[fetchedIssues.length - 1] || null;
      setCurrentPageIssues(fetchedIssues);
    };

    fetchIssues(currentPage);
  }, [currentPage]);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    
    setFormData((prev) => {
      return {
        ...prev,
        [name]: type ? (type === 'checkbox' ? checked : value) : value,
      }
    });
  }

  const handleFilter = async(filters: FormDataType) => {
    setIsLoading(true);

    try {
      let q = query(collection(db, "issues"), orderBy("time", "desc"));

      if (filters.isClaimedByMe) {
        q = query(q, where('claimedBy', '==', uid));
      }

      if (filters.isFinishedByMe) {
        q = query(q, where('finishedBy', '==', uid));
      }

      if (filters.isFavorited) {
        q = query(q, where('favedBy', 'array-contains', uid));
      }

      if (filters.isEasyFix) {
        q = query(q, where('difficulty', '==', 'easy-fix'));
      }

      if (filters.isUrgent) {
        q = query(q, where('isUrgent', '==', true));
      }

      if (filters.language && filters.language !== 'Select') {
        q = query(q, where('language', '==', filters.language));
      }

      const snapShot = await getDocs(q);
      let issues: IssueType[] = snapShot.docs.map((doc) => ({
        issueId: doc.id,
        description: doc.data().description,
        difficulty: doc.data().difficulty,
        isUrgent: doc.data().isUrgent,
        language: doc.data().language,
        time: doc.data().time,
        title: doc.data().title,
        claimedBy: doc.data().claimedBy,
        finishedBy: doc.data().finishedBy,
      }));

      if (filters.isAvailable) {
        // Client-side filtering, no way to check missing fields in Firestore directly
        issues = issues.filter(issue => !issue.claimedBy && !issue.finishedBy);
      }

      setFilteredIssues(issues);
      setIsFiltering(
        filters.isClaimedByMe || filters.isFinishedByMe || filters.isAvailable ||
        filters.isFavorited || filters.isEasyFix || filters.isUrgent || filters.language !== 'Select'
      );
      setCurrentPage(1);
    } catch (err) {
      console.error(`Search failed: ${err}`)
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    handleFilter(formData);
  }, [formData]);

  // Count total amount of issues and set page numbers
  const totalCount = isFiltering ? filteredIssues.length : allIssuesCount ?? 0;
  for (let i = 1; i <= Math.ceil(totalCount! / issuesPerPage); i++) {
    pageNums.push(i);
  }

  const renderPageNum = pageNums.map((num) => {
    return(
      <button key={num} onClick={() => setCurrentPage(num)} className={`px-3 py-1 mx-1 border rounded ${currentPage === num ? 'bg-blue-500 text-white' : ''}`}>
        {num}
      </button>
    )
  });

  const paginatedIssues = isFiltering
  ? filteredIssues.slice((currentPage - 1) * issuesPerPage, currentPage * issuesPerPage)
  : currentPageIssues;

  return (
    <>
    {/* filters */}
    <div className="flex">
      <div className="flex ml-auto">
        <div className="flex items-center me-4">
          <input className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 focus:ring-2"
            id="isClaimedByMe" name="isClaimedByMe" type="checkbox" checked={formData.isClaimedByMe} onChange={handleChange}  />
          <label htmlFor="isClaimedByMe" className="ms-2 text-m font-bold">Claimed by Me</label>
        </div>
        <div className="flex items-center me-4">
          <input className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 focus:ring-2"
            id="isFinishedByMe" name="isFinishedByMe" type="checkbox" checked={formData.isFinishedByMe} onChange={handleChange}  />
          <label htmlFor="isFinishedByMe" className="ms-2 text-m font-bold">Finished by Me</label>
        </div>
        <div className="flex items-center me-4">
          <input className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 focus:ring-2" 
            id="isAvailable" name="isAvailable" type="checkbox" checked={formData.isAvailable} onChange={handleChange} />
          <label htmlFor="isAvailable" className="ms-2 text-m font-bold">Available</label>
        </div>
        <div className="flex items-center me-4">
          <input className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 focus:ring-2" 
            id="isFavorited" name="isFavorited" type="checkbox" checked={formData.isFavorited} onChange={handleChange} />
          <label htmlFor="isFavorited" className="ms-2 text-m font-bold">Favorited</label>
        </div>
        <div className="flex items-center me-4">
          <input className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 focus:ring-2" 
            id="isEasyFix" name="isEasyFix" type="checkbox" checked={formData.isEasyFix} onChange={handleChange} />
          <label htmlFor="isEasyFix" className="ms-2 text-m font-bold">Easy fix</label>
        </div>
        <div className="flex items-center me-4">
          <input className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 focus:ring-2"
            id="isUrgent" name="isUrgent" type="checkbox" checked={formData.isUrgent} onChange={handleChange} />
          <label htmlFor="isUrgent" className="ms-2 text-m font-bold">Urgent</label>
        </div>
        <div className="flex items-center me-4">
          <label htmlFor="language" className="ms-2 text-m font-bold">Language</label>
          <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            id="language" name="language" value={formData.language} onChange={handleChange}>
            <option value="Select">-Select-</option>
            <option value="C">C</option>
            <option value="C++">C++</option>
            <option value="C#">C#</option>
            <option value="Java">Java</option>
            <option value="PHP">PHP</option>
            <option value="JavaScript">JavaScript</option>
            <option value="TypeScript">TypeScript</option>
            <option value="HTML">HTML</option>
            <option value="CSS">CSS</option>
            <option value="Python">Python</option>
            <option value="Go">Go</option>
            <option value="Ruby">Ruby</option>
            <option value="Rust">Rust</option>
            <option value="Kotlin">Kotlin</option>
            <option value="Swift">Swift</option>
            <option value="Dart">Dart</option>
            <option value="Scala">Scala</option>
            <option value="R">R</option>
            <option value="Perl">Perl</option>
            <option value="Elixir">Elixir</option>
            <option value="Haskell">Haskell</option>
            <option value="Erlang">Erlang</option>
            <option value="Assembly">Assembly</option>
            <option value="Matlab">Matlab</option>
            <option value="Visual Basic">Visual Basic</option>
            <option value="SQL">SQL</option>
            <option value="Lua">Lua</option>
            <option value="Others">Others</option>
          </select>
        </div>
      </div>
    </div> 

    { isLoading ? 
        'Loading' : 
        <>
          {/* issue previews */}
          <div className='flex flex-col gap-3 mb-3'>
            {paginatedIssues.map((issue) => (<PreviewCard key={issue.issueId} {...issue} />))}
          </div>
          {/* bottom page nav */}
          <div className='mt-4 flex justify-center'>{renderPageNum}</div>
        </>
    }
    </>
  )
}
