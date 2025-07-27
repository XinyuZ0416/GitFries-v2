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
        if (!uid) {
          alert(`Please sign in to view more issues`);
          return;
        }
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

  const handleFilterChange = (e: any) => {
    if (!uid) {
      alert(`Please sign in first`);
      return;
    }

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
    if (num === 1) {
      return(
        <button key={1} onClick={() => setCurrentPage(1)} 
          className={`font-bold px-3 py-1 mx-1 rounded border-4 border-black transition-transform duration-150 shadow-[4px_4px_0px_0px_black] hover:scale-105 hover:bg-yellow-700 hover:text-white ${currentPage === 1 ? 'bg-yellow-300 text-black' : ''}`}>
          {1}
        </button>
      )
    } else {
      if (!uid) {
        return(
          <button key={num} onClick={() => setCurrentPage(num)} \
            className={`font-bold px-3 py-1 mx-1 rounded border-4 border-black transition-transform duration-150 shadow-[4px_4px_0px_0px_black] hover:scale-105 hover:bg-yellow-700 hover:text-white`}>
            {num}
          </button>
        )
      } else {
        return(
          <button key={num} onClick={() => setCurrentPage(num)} 
            className={`font-bold px-3 py-1 mx-1 rounded border-4 border-black transition-transform duration-150 shadow-[4px_4px_0px_0px_black] hover:scale-105 hover:bg-yellow-700 hover:text-white ${currentPage === num ? 'bg-yellow-300 text-black' : ''}`}>
            {num}
          </button>
        )
      }
    }
  });

  const paginatedIssues = isFiltering
  ? filteredIssues.slice((currentPage - 1) * issuesPerPage, currentPage * issuesPerPage)
  : currentPageIssues;

  return (
    <>
    {/* filters */}
    <div className="flex justify-center items-center my-10">
      <div className="flex items-center me-4 transition-transform duration-150 hover:scale-105">
        <input className="hidden peer" id="isClaimedByMe" name="isClaimedByMe" type="checkbox" checked={formData.isClaimedByMe} onChange={handleFilterChange}  />
        <label htmlFor="isClaimedByMe" className="bg-yellow-300 cursor-pointer select-none shadow-[4px_4px_0px_0px_black] px-4 py-2 rounded border-4 border-black font-bold text-m peer-hover:bg-yellow-800 peer-hover:text-white peer-checked:bg-yellow-800 peer-checked:text-white transition-colors">👌🏻 Claimed by Me</label>
      </div>
      <div className="flex items-center me-4 transition-transform duration-150 hover:scale-105">
        <input className="hidden peer" id="isFinishedByMe" name="isFinishedByMe" type="checkbox" checked={formData.isFinishedByMe} onChange={handleFilterChange}  />
        <label htmlFor="isFinishedByMe" className="bg-yellow-300 cursor-pointer select-none shadow-[4px_4px_0px_0px_black] px-4 py-2 rounded border-4 border-black font-bold text-m peer-hover:bg-yellow-800 peer-hover:text-white peer-checked:bg-yellow-800 peer-checked:text-white transition-colors">✅ Finished by Me</label>
      </div>
      <div className="flex items-center me-4 transition-transform duration-150 hover:scale-105">
        <input className="hidden peer" id="isAvailable" name="isAvailable" type="checkbox" checked={formData.isAvailable} onChange={handleFilterChange} />
        <label htmlFor="isAvailable" className="bg-yellow-300 cursor-pointer select-none shadow-[4px_4px_0px_0px_black] px-4 py-2 rounded border-4 border-black font-bold text-m peer-hover:bg-yellow-800 peer-hover:text-white peer-checked:bg-yellow-800 peer-checked:text-white transition-colors">👀 Available</label>
      </div>
      <div className="flex items-center me-4 transition-transform duration-150 hover:scale-105">
        <input className="hidden peer" id="isFavorited" name="isFavorited" type="checkbox" checked={formData.isFavorited} onChange={handleFilterChange} />
        <label htmlFor="isFavorited" className="bg-yellow-300 cursor-pointer select-none shadow-[4px_4px_0px_0px_black] px-4 py-2 rounded border-4 border-black font-bold text-m peer-hover:bg-yellow-800 peer-hover:text-white peer-checked:bg-yellow-800 peer-checked:text-white transition-colors">♥️ Favorited</label>
      </div>
      <div className="flex items-center me-4 transition-transform duration-150 hover:scale-105">
        <input className="hidden peer" id="isEasyFix" name="isEasyFix" type="checkbox" checked={formData.isEasyFix} onChange={handleFilterChange} />
        <label htmlFor="isEasyFix" className="bg-yellow-300 cursor-pointer select-none shadow-[4px_4px_0px_0px_black] px-4 py-2 rounded border-4 border-black font-bold text-m peer-hover:bg-yellow-800 peer-hover:text-white peer-checked:bg-yellow-800 peer-checked:text-white transition-colors">😌 Easy fix</label>
      </div>
      <div className="flex items-center me-4 transition-transform duration-150 hover:scale-105">
        <input className="hidden peer" id="isUrgent" name="isUrgent" type="checkbox" checked={formData.isUrgent} onChange={handleFilterChange} />
        <label htmlFor="isUrgent" className="bg-yellow-300 cursor-pointer select-none shadow-[4px_4px_0px_0px_black] px-4 py-2 rounded border-4 border-black font-bold text-m peer-hover:bg-yellow-800 peer-hover:text-white peer-checked:bg-yellow-800 peer-checked:text-white transition-colors">⏳ Urgent</label>
      </div>
      <div className="flex items-center me-4 transition-transform duration-150 hover:scale-105">
        <select className="bg-yellow-300 cursor-pointer select-none shadow-[4px_4px_0px_0px_black] px-4 py-2 rounded border-4 border-black font-bold text-m peer-hover:bg-yellow-800 peer-hover:text-white peer-checked:bg-yellow-800 peer-checked:text-white transition-colors"
          id="language" name="language" value={formData.language} onChange={handleFilterChange}>
          <option value="Select">- 💻 Language-</option>
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
        <label htmlFor="language" className="ms-2 text-m font-bold"></label>
      </div>
    </div> 

    { isLoading ? 
        'Loading' : 
        <>
          {/* issue previews */}
          <div className='flex flex-col gap-3 mb-10 mx-10'>
            {paginatedIssues.map((issue) => (<PreviewCard key={issue.issueId} {...issue} />))}
          </div>
          {/* bottom page nav */}
          <div className='my-10 flex justify-center'>{renderPageNum}</div>
        </>
    }
    </>
  )
}
