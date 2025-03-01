import RequireSignInSignUp from '@/components/require-signin-signup'
import { Select, Textarea } from '@headlessui/react'
import React from 'react'

export default function PostIssuePage() {
  return (
    <>
    <RequireSignInSignUp target='Post an Issue' />
    {/* 如果用户已经登陆 */}
    {/* <div className='flex justify-center items-center h-screen'>
      <form className="mx-auto w-2/5">
        <div className="mb-5">
          <label htmlFor="issue_url" className="block mb-2 text-sm font-medium">Issue URL *</label>
          <input type="text" id="issue_url" name='issue_url' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
        </div>
        <div className="mb-5">
          <label htmlFor="issue_title" className="block mb-2 text-sm font-medium">Issue Title *</label>
          <input type="text" id="issue_title" name='issue_title' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
        </div>
        <div className="mb-5">
          <label htmlFor="issue_description" className="block mb-2 text-sm font-medium">Description</label>
          <Textarea id="issue_description" name='issue_description' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
        </div>
        <div className="mb-5 flex flex-row">
          <div>
            <label htmlFor="issue_language" className="block mb-2 text-sm font-medium">Language *</label>
            <Select id="issue_language" name='issue_language' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
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
            </Select>
          </div>
          <div>
            <label htmlFor="issue_difficulty" className="block mb-2 text-sm font-medium">Difficulty *</label>
            <Select id="issue_difficulty" name='issue_difficulty' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
              <option value='beginner-friendly'>Beginner Friendly</option>
              <option value='headache'>Headache</option>
            </Select>
          </div>
          <div className="flex items-center">
            <input id="checkbox-1" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" ></input>
            <label htmlFor="checkbox-1" className="ms-2 text-sm font-medium">Urgent</label>
          </div>
        </div>
        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
      </form>
    </div> */}
    </>
  )
}
