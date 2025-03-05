'use client'
import React, { useEffect, useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink, getAdditionalUserInfo } from "firebase/auth";
import { auth } from '@/app/firebase';

export default function SignUpCard() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let email = window.localStorage.getItem('emailForSignIn');
      if (!email) {
        email = window.prompt('Please provide your email for confirmation');
      }
      signInWithEmailLink(auth, email!, window.location.href)
        .then((result) => {
          window.localStorage.removeItem('emailForSignIn');
          console.log(getAdditionalUserInfo(result));
          getAdditionalUserInfo(result)?.profile
          getAdditionalUserInfo(result)?.isNewUser
        })
        .catch((error) => {
          console.error('Error signing in with email link:', error.code);
          setError(error.message);
        });
    }
  }, []);

  // useEffect(() => {
  //   const auth = getAuth();
  //   const signUp = async () => {
  //     try {
  //       if (isSignInWithEmailLink(auth, window.location.href)) {
  //         let email = window.localStorage.getItem('emailForSignIn');
  //         console.log(email)
  //         if (!email) { // User opened the link on a different device/ browser.
  //           email = window.prompt('Please provide your email for confirmation');
  //         }
  //         await signInWithEmailLink(auth, email!, window.location.href);
  //         window.localStorage.removeItem('emailForSignIn');
  //         // console.log(getAdditionalUserInfo(result));
  //       }
  //     } catch (error) {
  //       console.error('Error signing in with email link:', error.code);
  //       // error.code:
  //       // auth/missing-email
  //       // auth/invalid-action-code
  //       setError(error.message);
  //     }
  //   }

  //   signUp();
  // }, []);


  const actionCodeSettings = {
    // URL you want to redirect back to. The domain (www.example.com) for this
    // URL must be in the authorized domains list in the Firebase Console.
    url: 'http://localhost:3000/sign-in',
    // This must be true.
    handleCodeInApp: true,
    // The domain must be configured in Firebase Hosting and owned by the project.
    // linkDomain: 'custom-domain.com'
  };


  const handleSubmit = async(e) => {
    e.preventDefault();

    if(password !== repeatPassword) {
      throw new Error('Password not confirmed');
    }

    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem('emailForSignIn', email);
      console.log('sent email!')
    } catch (error) {
      setError(error.message);
      console.error("Error signing up:", error.message);
      const errorCode = error.code;
      const errorMessage = error.message;
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
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
          type='password' name="floating_password" id="floating_password" placeholder=" " value={password} onChange={(e) => setPassword(e.target.value)} required />
        <label htmlFor="floating_password" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
          Password
        </label>
      </div>
      <div className="relative z-0 w-full mb-5 group">
        <input className={`block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer ${password == repeatPassword ? '': 'border-red-500'}`}
          type="password" name="repeat_password" id="floating_repeat_password" placeholder=" " value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} required />
        <label htmlFor="floating_repeat_password" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
          Confirm password {password == repeatPassword ? '': '(Fill in the Same Password as Above)'}
        </label>
      </div>
      <div className="relative z-0 w-full mb-5 group">
        <input className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          type="text" name="floating_username" id="floating_username"  placeholder=" " value={username} onChange={(e) => setUsername(e.target.value)} required />
        <label htmlFor="floating_username" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
          Username
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
    </>
  )
}

