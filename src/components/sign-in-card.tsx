'use client'
import React, { useState } from 'react';
import { sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/app/firebase';

export default function SignInCard() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorCode, setErrorCode] = useState<string>('');
  const [isResetPassword, setIsResetPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async(e: any) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      if (!userCredential.user.emailVerified) {
        setErrorCode('auth/email-not-verified');
      }

      console.log('logged in!');
    } catch (error: any) {
      setErrorCode(error.code);
    } finally {
      setIsLoading(false);
    }
  }

  const handleResetPassword = async(e: any) => {
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setIsResetPassword(true);
    } catch (error: any) {
      const errorCode = error.code;
      const errorMessage = error.message;
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
    <form className="flex flex-col mx-auto w-2/5" onSubmit={handleSubmit} >
      <div className="mb-5">
        <label htmlFor="email" className="block mb-2 text-sm font-medium">Your email</label>
        <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
          type="email" id="email" placeholder="name@gitfries.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div className="mb-5">
        <label htmlFor="password" className="block mb-2 text-sm font-medium">Your password</label>
        <div className='flex flex-row relative'>
          <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
            type='password' id="password" placeholder="DefinitelyNot123456" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
      </div>
      <div className="flex items-start mb-5">
        <div className="flex items-center h-5">
          <input id="remember" type="checkbox" value="" className="w-4 h-4 border border-gray-300 rounded-sm bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800" />
        </div>
        <label htmlFor="remember" className="ms-2 text-sm font-medium">Remember me because I'm cool</label>
      </div>
      <button className="text-white bg-yellow-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
        type='button' onClick={handleResetPassword}>
        What was my password again?
      </button>
      <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
        type="submit">Sign In</button>
    </form>
    <h3 className='text-lg font-semibold text-green-600'>
      {isLoading && 'Loading...'}
      {isResetPassword && 'Check your email for password reset link.'}
    </h3>
    <h3 className='text-lg font-semibold text-red-600'>
      {errorCode == 'auth/invalid-credential' && 'Wrong email or password, try again.'}
      {errorCode == 'auth/email-not-verified' && 'Please find the verification link in your email and verify before logging in.'}
      {errorCode == 'auth/too-many-requests' && 'Chill.. You are seding too many requests, try again later.'}
    </h3>
    </>
  )
}
