'use client'
import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '@/app/firebase';

export default function SignInCard() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };


  const handleSubmit = async(e) => {
    e.preventDefault();

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('signed up!')
    } catch (error) {
      setError(error.message);
      console.error("Error signing up:", error.message);
    } finally {
      setLoading(false);
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
            type={showPassword ? 'text' : 'password'} id="password" placeholder="DefinitelyNot123456" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <span className='absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer'>
            <button type="button" onClick={togglePassword} className="block" aria-label="password toggle">
              <span className={`icon-[tabler--eye-off] text-base-content/80 ${showPassword ? 'hidden' : 'block'} size-5 flex-shrink-0`}></span>
              <span className={`icon-[tabler--eye] text-base-content/80 ${showPassword ? 'block' : 'hidden' } size-5 flex-shrink-0`}></span>
            </button>
          </span>
        </div>
      </div>
      <div className="flex items-start mb-5">
        <div className="flex items-center h-5">
          <input id="remember" type="checkbox" value="" className="w-4 h-4 border border-gray-300 rounded-sm bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800" />
        </div>
        <label htmlFor="remember" className="ms-2 text-sm font-medium">Remember me because I'm cool</label>
      </div>
      <a href='/forgot-password'>What was my password again?</a>
      <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
        type="submit">Sign In</button>
    </form>
    </>
  )
}
