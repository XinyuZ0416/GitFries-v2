'use client'
import React, { useEffect, useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink, getAdditionalUserInfo } from "firebase/auth";
import { auth } from '@/app/firebase';

export default function SignInCard() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Confirm the link is a sign-in with email link.
    const auth = getAuth();
    if (isSignInWithEmailLink(auth, window.location.href)) {
      // Additional state parameters can also be passed via URL.
      // This can be used to continue the user's intended action before triggering
      // the sign-in operation.
      // Get the email if available. This should be available if the user completes
      // the flow on the same device where they started it.
      let email = window.localStorage.getItem('emailForSignIn');
      if (!email) {
        // User opened the link on a different device. To prevent session fixation
        // attacks, ask the user to provide the associated email again. For example:
        email = window.prompt('Please provide your email for confirmation');
      }
      // The client SDK will parse the code from the link for you.
      signInWithEmailLink(auth, email!, window.location.href)
        .then((result) => {
          // Clear email from storage.
          window.localStorage.removeItem('emailForSignIn');
          // You can access the new user by importing getAdditionalUserInfo
          // and calling it with result:
          console.log(getAdditionalUserInfo(result));
          // You can access the user's profile via:
          getAdditionalUserInfo(result)?.profile
          // You can check if the user is new or existing:
          getAdditionalUserInfo(result)?.isNewUser
        })
        .catch((error) => {
          // Some error occurred, you can inspect the code: error.code
          // Common errors could be invalid email and invalid or expired OTPs.
          console.error('Error signing in with email link:', error.code);
          // error.code:
          // auth/missing-email
          // auth/invalid-action-code
          setError(error.message);
          
        });
    }
  }, []);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

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
