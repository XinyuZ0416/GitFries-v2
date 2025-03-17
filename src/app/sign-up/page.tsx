'use client'
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import React, { useEffect, useState } from 'react'
import { auth } from '../firebase';
import CheckUnchecked from '@/components/check-unchecked';
import { useAuth } from '@/components/providers';
import { useRouter } from 'next/navigation';

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
  const { isVerified, setIsVerified } = useAuth();
  const router = useRouter();
  const [ passwordCriteria, setPasswordCriteria ] = useState<PasswordCriteriaType>({
    isUpperCase: false,
    isLowerCase: false,
    isSpecialChar: false,
    isNumber: false,
    isLongerThanSix: false,
  });

  useEffect(() => {
    if (isVerified) {
      router.push('/profile');
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
        console.log('sent email!')

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
      <div className='flex flex-col justify-center items-center h-screen'>
        <form className="mx-auto w-2/5" onSubmit={handleSubmit}>
          <div className="relative z-0 w-full mb-5 group">
            <input className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" 
              type="email" name="floating_email" id="floating_email" placeholder=" " value={email} onChange={(e) => setEmail(e.target.value)} required />
            <label htmlFor="floating_email" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Email address
            </label>
          </div>
          <div className="relative z-0 w-full mb-5 group">
            <input className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" 
              type='password' name="floating_password" id="floating_password" placeholder=" " value={password} onChange={handleSetPassword} required />
            <label htmlFor="floating_password" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Password
            </label>
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
          <div className="relative z-0 w-full mb-5 group">
            <input className={`block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer ${password == repeatPassword ? '': 'border-red-500'}`}
              type="password" name="repeat_password" id="floating_repeat_password" placeholder=" " value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} required />
            <label htmlFor="floating_repeat_password" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Repeat Password
            </label>
          </div>
          <div className="flex items-center mb-4">
            <input className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 focus:ring-2" 
              id="checkbox-1" type="checkbox" value="" required ></input>
            <label htmlFor="checkbox-1" className="ms-2 text-sm font-medium">I agree to the <a href="#" className="text-blue-600 hover:underline">terms and conditions</a> (because why not)</label>
          </div>
          <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
            type="submit" >Sign Up</button>
        </form>
        <h3 className='text-lg font-semibold text-green-600'>
          {isLoading && 'Loading...'}
        </h3>
        {errorMessage && <h3 className='text-lg font-semibold text-red-600'>{errorMessage}</h3>}
      </div>
    }
  </>
  )
}
