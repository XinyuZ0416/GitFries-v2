'use client'
import { sendPasswordResetEmail } from 'firebase/auth';
import React, { useState } from 'react'
import { auth } from '../firebase';
import { useAuth } from '@/components/providers';
import { useRouter } from 'next/navigation';

export default function Settings() {
  const [ isLoading, setIsLoading ] = useState<boolean>(false);
  const [ isResetPassword, setIsResetPassword ] = useState<boolean>(false);
  const { email, setUid, setIsVerified } = useAuth();
  const router = useRouter();

  // TODO: if no user/ user not verified, dont show content

  const handleResetEmail = () => {
    console.log('reset email')
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

  const handleDeleteAccount = async () => {
    const user = auth.currentUser;
    setIsLoading(true);

    try {
      // TODO: 1. double check with user 2. send verification via email
      await user!.delete();
      console.log('user deleted');
      setUid('');
      setIsVerified(false);
      router.push('/');
    } catch (error: any) {
      console.error(error.code);
      // auth/requires-recent-login
      // undefined
    } finally {
      setIsLoading(false);
    }
  }
  
  return (
    <>
    <div className='flex flex-col justify-center items-center h-screen'>
      <form className="mx-auto w-2/5">
        <fieldset className="mb-5">
          <label htmlFor="issue_url" className="block mb-2 text-sm font-medium">Profile Picture</label>
          <input type="text" id="issue_url" name='issue_url' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
        </fieldset>
        <fieldset className="mb-5">
          <label htmlFor="issue_title" className="block mb-2 text-sm font-medium">Username</label>
          <input type="text" id="issue_title" name='issue_title' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
        </fieldset>
        <fieldset className="mb-5">
          <label htmlFor="issue_description" className="block mb-2 text-sm font-medium">Description</label>
          <textarea id="issue_description" rows={4} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"></textarea>
        </fieldset>
        <button className="text-white bg-yellow-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          type='button' onClick={handleResetEmail}>
          Reset Email
        </button>
        <button className="text-white bg-yellow-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          type='button' onClick={handleResetPassword}>
          Reset Password
        </button>
        <button className="text-white bg-red-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          type='button' onClick={handleDeleteAccount}>
          Delete Account
        </button>
        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
      </form>

      <h3 className='text-lg font-semibold text-green-600'>
        {isLoading && 'Loading...'}
        {isResetPassword && 'Check your email for password reset link.'}
      </h3>
    </div>
    <p></p>
    <p>description</p>
    <p>username</p>
    <p>password</p>
    <p>delete account</p>
    </>
  )
}
