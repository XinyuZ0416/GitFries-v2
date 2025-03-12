'use client'
import { sendPasswordResetEmail } from 'firebase/auth';
import React, { useEffect, useState } from 'react'
import { auth, db } from '../firebase';
import { useAuth } from '@/components/providers';
import { useRouter } from 'next/navigation';
import { addDoc, collection } from 'firebase/firestore';

type FormDataType = {
  uid: string,
  pic: string,
  username: string,
  bio: string,
}

export default function Settings() {
  const [ isLoading, setIsLoading ] = useState<boolean>(false);
  const [ isResetPassword, setIsResetPassword ] = useState<boolean>(false);
  const { email, uid, setUid, isVerified, setIsVerified } = useAuth();
  const router = useRouter();
  const [ formData, setFormData ] = useState<FormDataType>({
    uid: '',
    pic: '',
    username: '',
    bio: '',
  });

  // TODO: if no user/ user not verified, dont show content
  useEffect(() => {
    if(isVerified){
      setFormData((prev) => ({...prev, uid: uid}));
    }
  }, [uid]);

  const handleSubmit = async() => {
    // TODO: create user data upon email verification, and use update instead of create here
    await addDoc(collection(db, "users"), {
      uid: formData.uid,
      pic: formData.pic,
      username: formData.username,
      bio: formData.bio,
    });
  }

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      return {
        ...prev,
        [name]: value,
      }
    });
  }

  const handleResetEmail = () => {
    // TODO: UI update & implement method
    console.log('reset email link sent')
  }

  const handleResetPassword = async(e: any) => {
    // TODO: UI update
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
      <form className="mx-auto w-2/5" onSubmit={handleSubmit}>
        <fieldset className="mb-5">
          <label htmlFor="pic" className="block mb-2 text-sm font-medium">Profile Picture</label>
          <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            type="text" id="pic" name='pic' value={formData.pic} onChange={handleChange} required />
        </fieldset>
        <fieldset className="mb-5">
          <label htmlFor="username" className="block mb-2 text-sm font-medium">Username</label>
          <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            type="text" id="username" name='username' value={formData.username} onChange={handleChange} required />
        </fieldset>
        <fieldset className="mb-5">
          <label htmlFor="bio" className="block mb-2 text-sm font-medium">Bio</label>
          <textarea className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            id="bio" name="bio" value={formData.bio} rows={4} onChange={handleChange} ></textarea>
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
        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Update</button>
      </form>

      <h3 className='text-lg font-semibold text-green-600'>
        {isLoading && 'Loading...'}
        {isResetPassword && 'Check your email for password reset link.'}
      </h3>
    </div>
    </>
  )
}
