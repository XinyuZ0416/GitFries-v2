'use client'
import RequireSignInSignUp from '@/components/require-signin-signup'
import React, { useEffect, useState } from 'react'

export default function PostIssuePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Avoid rendering until mounted on client-side
  
  return (
    <>
    {/* <RequireSignInSignUp target='Post an Issue' /> */}
    {/* 如果用户已经登陆 */}
    <div className='flex justify-center items-center h-screen'>
      <form className="mx-auto w-2/5">
        <fieldset className="mb-5">
          <label htmlFor="issue_url" className="block mb-2 text-sm font-medium">Issue URL *</label>
          <input type="text" id="issue_url" name='issue_url' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
        </fieldset>
        <fieldset className="mb-5">
          <label htmlFor="issue_title" className="block mb-2 text-sm font-medium">Issue Title *</label>
          <input type="text" id="issue_title" name='issue_title' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
        </fieldset>
        <fieldset className="mb-5">
          <label htmlFor="issue_description" className="block mb-2 text-sm font-medium">Description</label>
          <textarea id="issue_description" rows={4} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"></textarea>
        </fieldset>
        <div className="mb-5 flex flex-row">
          <fieldset className="max-w-sm mx-auto">
            <label htmlFor="issue_language" className="block mb-2 text-sm font-medium">Language *</label>
            <select id="issue_language" defaultValue={'C'} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <option value='C'>C</option>
              <option value='C++'>C++</option>
              <option value='C#'>C#</option>
              <option value='CSS'>CSS</option>
              <option value='Go'>Go</option>
              <option value='HTML'>HTML</option>
              <option value='Java'>Java</option>
              <option value='Javascript'>Javascript</option>
              <option value='Kotlin'>Kotlin</option>
              <option value='Matlab'>Matlab</option>
              <option value='NoSQL'>NoSQL</option>
              <option value='Perl'>Perl</option>
              <option value='PHP'>PHP</option>
              <option value='Python'>Python</option>
              <option value='R'>R</option>
              <option value='Ruby'>Ruby</option>
              <option value='Rust'>Rust</option>
              <option value='Scala'>Scala</option>
              <option value='SQL'>SQL</option>
              <option value='Swift'>Swift</option>
              <option value='TypeScript'>TypeScript</option>
              <option value='Others'>Others</option>
            </select>
          </fieldset>
          <fieldset className="max-w-sm mx-auto">
            <label htmlFor="issue_difficulty" className="block mb-2 text-sm font-medium">Difficulty *</label>
            <select id="issue_difficulty" defaultValue={'headache'} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <option value='headache'>Headache</option>
              <option value='beginner-friendly'>Beginner Friendly</option>
            </select>
          </fieldset>
          <fieldset className="flex items-center">
            <input id="checkbox-1" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" ></input>
            <label htmlFor="checkbox-1" className="ms-2 text-sm font-medium">Urgent</label>
          </fieldset>
        </div>
        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
      </form>
    </div>
    </>
  )
}
