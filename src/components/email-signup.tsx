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
        <label className="text-3xl font-bold text-center" htmlFor="email">Join GitFries to {goal}</label>
        <div className='flex mt-10'>
          <input type="email" id="email" placeholder="Enter your email" 
            className="shadow-[4px_4px_0px_0px_black] bg-white border-4 border-black transition-transform duration-150 hover:scale-105 text-gray-900 md:w-64 mb-2 md:mb-0 md:me-4 text-lg rounded-lg block w-full p-2.5" required />
          <button onClick={handleSignUp} 
            className="shadow-[4px_4px_0px_0px_black] border-4 border-black transition-transform duration-150 hover:scale-105 text-white bg-blue-700 hover:bg-blue-800 font-bold rounded-lg text-lg w-full sm:w-auto px-5 py-2.5 text-center"> Sign Up - It's Free!</button>
        </div>
      </form>
    </>
  )
}
