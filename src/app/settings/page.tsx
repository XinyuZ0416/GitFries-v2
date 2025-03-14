'use client'
import { sendPasswordResetEmail } from 'firebase/auth';
import React, { useEffect, useState } from 'react'
import { auth, db } from '../firebase';
import { useAuth } from '@/components/providers';
import { useRouter } from 'next/navigation';
import { doc, updateDoc } from 'firebase/firestore';
import { File } from 'buffer';

type FormDataType = {
  file_input: string,
  username: string,
  bio: string,
}

export default function Settings() {
  const [ isLoading, setIsLoading ] = useState<boolean>(false);
  const [ isResetPassword, setIsResetPassword ] = useState<boolean>(false);
  const { email, uid, setUid, isVerified, setIsVerified, userDbId } = useAuth();
  const router = useRouter();
  const [ formData, setFormData ] = useState<FormDataType>({
    file_input: '',
    username: '',
    bio: '',
  });
  const fileTypes = ["image/jpeg", "image/jpg", "image/png",];

  // TODO: if no user/ user not verified, dont show content

  const handleSubmit = async() => {
    // Only update modified fields
    const updatedData: Partial<FormDataType> = {};
    if (formData.file_input) updatedData.file_input = formData.file_input;
    if (formData.username) updatedData.username = formData.username;
    if (formData.bio) updatedData.bio = formData.bio;

    await updateDoc(doc(db, "users", userDbId), updatedData);
  }

  const handleChange = (e: any) => {
    const { name, value, files } = e.target;

    if (name === "file_input") {
      if (!fileTypes.includes(files[0].type)) {
        alert('invalid file type');
        return;
      } else if (files[0].size > 3 * 1024 * 1024) {
        alert('file to large');
        return;
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
      // TODO: 1. double check with user 2. send verification via email 3. delete from users db
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
          <label className="block mb-2 text-sm font-medium" htmlFor="file_input">Profile Picture</label>
          <input className="block w-full text-sm border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none" 
            aria-describedby="file_input_help" id="file_input" name="file_input" type="file" value={formData.file_input} onChange={handleChange}></input>
          <p className="mt-1 text-sm" id="file_input_help">.jpg/.jpeg/.png (MAX 3MB)</p>
        </fieldset>
        <fieldset className="mb-5">
          <label htmlFor="username" className="block mb-2 text-sm font-medium">Username</label>
          <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            type="text" id="username" name='username' value={formData.username} onChange={handleChange} />
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
