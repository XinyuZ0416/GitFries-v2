'use client'
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import React, { useEffect, useState } from 'react'
import { auth } from '../firebase';
import CheckUnchecked from '@/components/check-unchecked';
import { useAuthProvider } from '@/providers/auth-provider';
import { useRouter } from 'next/navigation';
import { useNavbarProvider } from '@/providers/navbar-provider';

type PasswordCriteriaType = {
  isUpperCase: boolean,
  isLowerCase: boolean,
  isSpecialChar: boolean,
  isNumber: boolean,
  isLongerThanSix: boolean,
}

export default function SignUpPage() {
  const [ email, setEmail ] = useState<string>('');
  const [ password, setPassword ] = useState<string>('');
  const [ repeatPassword, setRepeatPassword ] = useState<string>('');
  const [ errorCode, setErrorCode ] = useState<string>('');
  const [ isLoading, setIsLoading ] = useState<boolean>(false);
  const { isVerified, setIsVerified } = useAuthProvider();
  const router = useRouter();
  const { height } = useNavbarProvider();
  const navbarHeight = height ?? 64;
  const [ passwordCriteria, setPasswordCriteria ] = useState<PasswordCriteriaType>({
    isUpperCase: false,
    isLowerCase: false,
    isSpecialChar: false,
    isNumber: false,
    isLongerThanSix: false,
  });

  useEffect(() => {
    if (isVerified) {
      router.push('/settings');
    }
  }, [isVerified]);

  const handleSubmit = async(e: any) => {
    e.preventDefault();
    setIsLoading(true);

    // Check if password matches repeat password
    if (password == repeatPassword) {
      if (errorCode == 'passwords/mismatch') {
        setErrorCode('');
      }

      try {
        // Send email verification
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(userCredential.user);
        alert('The verification email has been sent!');

        // Check email verification status every 1s
        const interval = setInterval(async() => {
          if (auth.currentUser) {
            auth.currentUser.reload();

            if(auth.currentUser.emailVerified) {
              setIsVerified(true);
              clearInterval(interval);
              router.push('/profile');
            }
          } 
        }, 1000);
      } catch (error: any) {
        setErrorCode(error.code);
      } finally {
        setIsLoading(false);
      }
    } else {
      setErrorCode('passwords/mismatch');
    }
  }
  
  const handleSetPassword = (e: any) => {
    let input = e.target.value;
    setPassword(input);
    
    // Check password validity
    setPasswordCriteria({
      isUpperCase: /[A-Z]/.test(input),
      isLowerCase: /[a-z]/.test(input),
      isSpecialChar: /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(input),
      isNumber: /\d/.test(input),
      isLongerThanSix: input.length >= 6,
    });
  }

  const errorMessage = 
    errorCode == 'auth/weak-password' ? 'Your password is too weak, try harder.' :
    errorCode == 'passwords/mismatch' ? 'Your passwords are not matching, try again.' :
    errorCode == 'auth/email-already-in-use' ? 'Email already in use, did you forget the password?' :
    "";

  return (
    <>
    { isVerified ? 
      'You have signed in. Redirecting to profile page...' :  // TODO: implement redirect
      <div className='flex flex-col justify-center items-center' style={{ height: `calc(100vh - ${navbarHeight}px)` }}>
        <form className="flex flex-col mx-auto w-2/5 gap-3" onSubmit={handleSubmit}>
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
                type='password' id="password" placeholder="DefinitelyNot123456" value={password} onChange={handleSetPassword} required />
            </div>
          </div>
          <div>
            { password &&
              <>
              <CheckUnchecked condition={passwordCriteria.isUpperCase} explanation='at least 1 uppercase character' />
              <CheckUnchecked condition={passwordCriteria.isLowerCase} explanation='at least 1 lowercase character' />
              <CheckUnchecked condition={passwordCriteria.isSpecialChar} explanation='at least 1 special character' />
              <CheckUnchecked condition={passwordCriteria.isNumber} explanation='at least 1 number' />
              <CheckUnchecked condition={passwordCriteria.isLongerThanSix} explanation='at least 6 characters' />
              </>
            }
          </div>
          <div>
            <label htmlFor="repeat_password" className="block mb-2 text-3xl font-bold">Repeat Password</label>
            <div className='flex flex-row relative'>
              <input className="transition-transform duration-150 hover:scale-105 shadow-[4px_4px_0px_0px_black] border-2 border-black bg-gray-50 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                type='password' name="repeat_password" id="repeat_password" placeholder="DefinitelyNot123456" value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} required />
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input className="transition-transform duration-150 hover:scale-150 shadow-[2px_2px_0px_0px_black] border-2 border-black w-4 h-4 rounded-sm bg-gray-50"
                id="checkbox-1" type="checkbox" value="" required/>
            </div>
            <label htmlFor="checkbox-1" className="ms-2 text-lg font-bold">I agree to the <a href="#" className="text-blue-600 hover:underline">terms and conditions</a> 🤞🏻</label>
          </div>
          <button className="transition-transform duration-150 hover:scale-105 shadow-[4px_4px_0px_0px_black] border-2 border-black text-white bg-blue-700 hover:bg-blue-800 font-bold rounded-lg text-xl w-full sm:w-auto px-5 py-2.5 text-center"
            type="submit" >Sign Up</button>
        </form>
        {/* Toast Message */}
        {(isLoading ||  errorCode) && (
          <div className="fixed bottom-6 right-6 z-50">
            <div className={`p-4 rounded-lg shadow-lg text-white text-md font-semibold transition-all 
              ${errorCode ? 'bg-red-600' : 'bg-blue-600'}`}>
              {isLoading && 'Loading... '}
              {errorCode && `${errorCode}`}
            </div>
          </div>
        )}
      </div>
    }
  </>
  )
}
