import { useRouter } from 'next/navigation'
import React from 'react'

interface EmailSignUpProps {
  goal: string
}

export default function EmailSignUp({goal}: EmailSignUpProps) {
  const router = useRouter();

  const handleSignUp = () => {
    router.push('/sign-up');
  }
  return (
    <>
      <form className="flex flex-col items-center w-full">
        <label className="text-2xl font-semibold text-center" htmlFor="email">Join GitFries to {goal}</label>
        <div className='flex'>
          <input type="email" id="email" placeholder="Enter your email" className="bg-white border border-gray-300 text-gray-900 md:w-64 mb-2 md:mb-0 md:me-4 text-sm rounded-lg focus:ring-orange-900 focus:border-orange-900 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
          <button onClick={handleSignUp} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"> Sign Up - It's Free!</button>
        </div>
      </form>
    </>
  )
}
