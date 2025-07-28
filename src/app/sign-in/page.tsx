'use client'
import { useAuthProvider } from '@/providers/auth-provider';
import { browserLocalPersistence, browserSessionPersistence, sendPasswordResetEmail, setPersistence, signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { auth } from '../firebase';
import { useNavbarProvider } from '@/providers/navbar-provider';

export default function SignInPage() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorCode, setErrorCode] = useState<string>('');
  const [isResetPassword, setIsResetPassword] = useState<boolean>(false);
  const [isRememberMe, setIsRememberMe] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const { isVerified, setIsVerified, uid, setUid} = useAuthProvider();
  const { height } = useNavbarProvider();
  const navbarHeight = height ?? 64;

  useEffect(() => {
    if (isVerified) {
      router.push('/issues');
    }
  }, [isVerified]);

  const handleSubmit = async(e: any) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (!userCredential.user.emailVerified) {
        setErrorCode('auth/email-not-verified');
      } else {
        setPersistence(auth, isRememberMe ? browserLocalPersistence :browserSessionPersistence);
        setUid(uid);
        setIsVerified(true);
        router.push('/profile');
      }
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
    { isVerified ? 
      'Redirecting to issues page...' :  // TODO: implement redirect
      <div className='flex flex-col justify-center items-center' style={{ height: `calc(100vh - ${navbarHeight}px)` }}>
        <form className="flex flex-col mx-auto w-2/5 gap-7" onSubmit={handleSubmit} >
          <div>
            <label htmlFor="email" className="block mb-2 text-3xl font-bold">Email</label>
            <div className='flex flex-row relative'>
              <input className="transition-transform duration-150 hover:scale-105 shadow-[4px_4px_0px_0px_black] border-2 border-black bg-gray-50 text-gray-900 text-sm rounded-lg block w-full p-2.5"
              type="email" id="email" placeholder="YouWontGetAwayWithNonEmail@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="block mb-2 text-3xl font-bold">Password</label>
            <div className='flex flex-row relative'>
              <input className="transition-transform duration-150 hover:scale-105 shadow-[4px_4px_0px_0px_black] border-2 border-black bg-gray-50 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                type='password' id="password" placeholder="DefinitelyNot123456" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input className="transition-transform duration-150 hover:scale-150 shadow-[2px_2px_0px_0px_black] border-2 border-black w-4 h-4 rounded-sm bg-gray-50"
                id="remember" type="checkbox" checked={isRememberMe} onChange={(e) => setIsRememberMe(e.target.checked)} />
            </div>
            <label htmlFor="remember" className="ms-2 text-lg font-bold">Remember me please 🥺</label>
          </div>
          <button className="underline text-lg font-bold transition-transform duration-150 hover:scale-150"
            type='button' onClick={handleResetPassword}>
            What is my password again 😫?
          </button>
          <button className="transition-transform duration-150 hover:scale-105 shadow-[4px_4px_0px_0px_black] border-2 border-black text-white bg-blue-700 hover:bg-blue-800 font-bold rounded-lg text-xl w-full sm:w-auto px-5 py-2.5 text-center"
            type="submit">Sign In</button>
        </form>

        {/* Toast Message */}
        {(isLoading || isResetPassword || errorCode) && (
          <div className="fixed bottom-6 right-6 z-50">
            <div className={`p-4 rounded-lg shadow-lg text-white text-md font-semibold transition-all 
              ${isLoading ? 'bg-blue-600' : isResetPassword ? 'bg-green-600' : 'bg-red-600'}`}>
              {isLoading && 'Loading... '}
              {isResetPassword && 'Check your email for password reset link.'}
              {errorCode && `${errorCode}`}
            </div>
          </div>
        )}
      </div>
    }
    </>
  )
}
