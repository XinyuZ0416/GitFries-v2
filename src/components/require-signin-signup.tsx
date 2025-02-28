import React from 'react'

interface RequireSignInSignUpProps {
  target: string
}

export default function RequireSignInSignUp({target}: RequireSignInSignUpProps) {
  return (
    <>
    <div className="flex flex-col h-screen justify-center items-center">
      <h1 className="text-4xl font-bold"><a href="/sign-up" className='underline'>Sign In</a> or <a href="/sign-up" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none">Sign Up</a> to {target}</h1>
    </div>
    </>
  )
}
