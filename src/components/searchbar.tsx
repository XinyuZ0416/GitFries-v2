'use client'
import { useAuthProvider } from '@/providers/auth-provider';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react'

export default function Searchbar() {
  const [ query, setQuery ] = useState<string>('');
  const [ isLoading, setIsLoading ] = useState<boolean>(false);
  const [ hasSearched, setHasSearched ] = useState(false);
  const [ results, setResults ] = useState<any[]>([]);
  const searchbarRef = useRef<HTMLDivElement>(null);
  const { uid } = useAuthProvider();

  const handleSearch = async(e: React.FormEvent) => {
    e.preventDefault();
    if (!uid) {
      alert('please sign in first');
      return;
    }
    
    if (!query.trim()) return;

    setIsLoading(true);
    setHasSearched(true);

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();

      if (data?.hits) {
        setResults(data.hits.map((hit: any) => hit.document));
      } else {
        setResults([]);
      }
    } catch (err) {
      console.error(`Search failed: ${err}`)
    } finally {
      setIsLoading(false);
    }
  }

  const renderResults = () => {
    return results?.map((doc, i) => (
      <Link key={i} href={`/issues/${doc.id}`}>
        <li className="p-3 border rounded bg-white shadow">
          <p className="font-bold">{doc.title}</p>
          {doc.description && <p className="text-sm text-gray-600">{doc.description}</p>}
        </li>
      </Link>
    ));
  }

  // Monitor clicks outside searchbar
  useEffect(() => {
    const handleClicksOutsideSearchbar = (e: MouseEvent) => {
      if (searchbarRef.current && !searchbarRef.current.contains(e.target as Node)) {
        setResults([]);
        setHasSearched(false);
      }
    }

    document.addEventListener('mousedown', handleClicksOutsideSearchbar);
    return () => document.removeEventListener('mousedown', handleClicksOutsideSearchbar);
  },[]);

  return (
    <>
    <div ref={searchbarRef} className="relative flex">
      <form className="max-w-lg mx-auto w-full" onSubmit={handleSearch}>
        <div className="flex">
          <label htmlFor="search" className="mb-2 text-sm font-medium text-gray-900 sr-only">Search</label>          
          <div className="relative w-full">
            <input className="shadow-[4px_4px_0px_0px_black] border-4 border-black block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-lg focus:ring-yellow-700 focus:border-yellow-700" 
              type="search" id="search" placeholder="Search for an issue" value={query} onChange={(e) => setQuery(e.target.value)} required />
            <button type="submit" className="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white bg-yellow-700 rounded-e-lg border-black border-4 hover:bg-yellow-700 focus:ring-4 focus:outline-none focus:ring-yellow-700">
              <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
              </svg>
              <span className="sr-only">Search</span>
            </button>
          </div>
        </div>
      </form>
      
      {(results.length > 0 || hasSearched) && (
        <div className='absolute top-full mt-2 w-full max-w-lg bg-white border shadow-lg rounded z-50'>
          <ul className='divide-y'>
            { isLoading ? 
              <li className="p-3 border rounded bg-white shadow">
                <p className="font-bold">Loading</p>
              </li> : 
              results?.length > 0 ? 
                renderResults():
                <li className="p-3 border rounded bg-white shadow">
                  <p className="font-bold">No result</p>
                </li>
            }
          </ul>
        </div>
      )}
    </div>
    </>
  )
}