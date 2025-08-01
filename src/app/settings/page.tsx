'use client'
import { EmailAuthProvider, reauthenticateWithCredential, sendPasswordResetEmail, signOut, verifyBeforeUpdateEmail } from 'firebase/auth';
import React, { useEffect, useState } from 'react'
import { auth, db, storage } from '../firebase';
import { useAuthProvider } from '@/providers/auth-provider';
import { useRouter } from 'next/navigation';
import { deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useNavbarProvider } from '@/providers/navbar-provider';

type FormDataType = {
  username: string,
  bio: string,
}

export default function Settings() {
  const [ isLoading, setIsLoading ] = useState<boolean>(false);
  const [ isResetPassword, setIsResetPassword ] = useState<boolean>(false);
  const [ placeHolderUsername, setPlaceHolderUsername] = useState<string>('');
  const [ placeHolderBio, setPlaceHolderBio] = useState<string>('');
  const [ newEmail, setNewEmail ] = useState<string>('');
  const [ errorCode, setErrorCode ] = useState<string>('');
  const { email, uid, setUserPicUrl, isVerified } = useAuthProvider();
  const router = useRouter();
  const { height } = useNavbarProvider();
  const navbarHeight = height ?? 64;
  const [ formData, setFormData ] = useState<FormDataType>({
    username: '',
    bio: '',
  });
  const fileTypes = ["image/jpeg", "image/jpg", "image/png",];

  useEffect(() => {
    if (isVerified === null || !isVerified) {
      router.push('/sign-in');
    }
    console.log(uid)
  }, [isVerified]);

  useEffect(() => {
    if (!uid) {
      return;
    }
    
    const getUsernameAndBio = async () => {
      const userDocRef = doc(db, "users", uid);
  
      try {
        const userDocSnap = await getDoc(userDocRef);
        const userData = userDocSnap.data();
        setPlaceHolderUsername(userData?.username || '');
        setPlaceHolderBio(userData?.bio || '');
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
  
    getUsernameAndBio();
  }, [uid]);

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault(); // Prevent page reload

  // Only update changed fields
  const updatedData: Partial<FormDataType> = {};
  if (formData.username) updatedData.username = formData.username;
  if (formData.bio) updatedData.bio = formData.bio;

  try {
    await updateDoc(doc(db, "users", uid), updatedData);
    alert('Profile updated successfully.');
  } catch (error) {
    console.error("Error updating user data:", error);
  }
}

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  const handleFileSelectAndUpload = async(e: any) => {
    const { files } = e.target;
    const storageRef = ref(storage, `user-img/${uid}`);

    setIsLoading(true);
    
    // No file selected, do nothing
    if (!files.length) return;

    // File selected, check file type and size
    if (!fileTypes.includes(files[0].type)) {
      alert('invalid file type');
      e.target.value = ''; // reset so that user doesn't see the file name
      return;
    } else if (files[0].size > 3 * 1024 * 1024) {
      alert('file to large');
      e.target.value = '';
      return;
    }

    // Upload file
    try {
      await uploadBytes(storageRef, files[0]);
      console.log('Uploaded file!');

      setUserPicUrl(await getDownloadURL(storageRef));
      alert('Profile picture updated!');
    } catch (error) {
      console.error(error);
      alert(`Something went wrong:${error}`);
    } finally {
      setIsLoading(false);
    }
  }

  const handleResetEmail = async(e: any) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await verifyBeforeUpdateEmail(auth.currentUser!, newEmail);
      console.log('email verification sent!')
      alert('A verification link has been sent to your new email.');
      await signOut(auth);
    } catch(error: any) {
      console.error(error.code);
      setErrorCode(error.code);
    } finally {
      setIsLoading(false);
    }
  }

  const handleResetPassword = async(e: any) => {
    // TODO: UI update
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setIsResetPassword(true);
      alert('A password reset link has been sent to your email.');
      await signOut(auth);
      router.push('/sign-in');
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
      // Re-auth user with forcing password check
      const password = prompt('For security concern, please enter your password to confirm account deletion.');
      if(!password) return;

      const credential = EmailAuthProvider.credential(user!.email!, password);
      await reauthenticateWithCredential(user!,credential)

      await user!.delete();
      alert('Your account has been deleted.');
      await deleteDoc(doc(db, "users", uid));
      await signOut(auth);
    } catch (error: any) {
      console.error(error.code);
      setErrorCode(error.code);
      // auth/requires-recent-login
      // undefined
      // auth/invalid-credential (password is wrong)
    } finally {
      setIsLoading(false);
    }
  }

  const errorMessage = 
    errorCode === "auth/requires-recent-login" ? "Last log in was too long ago. For security concern, please log in again and reset email."
      : errorCode === "auth/invalid-credential" ? "Wrong password, please try again."
      : "";

  return (
    <>
    <div className='flex flex-col justify-center items-center m-10' style={{ height: `calc(100vh - ${navbarHeight}px)` }}>
      {/* Profile picture */}
      <div className="mb-5 w-2/5">
        <label className="block mb-2 text-2xl font-bold" htmlFor="file_input">Profile Picture</label>
        <input className="border-2 border-black shadow-[4px_4px_0px_0px_black] transition-transform duration-150 hover:scale-105 block w-full text-sm font-bold rounded-lg cursor-pointer bg-gray-50" 
          aria-describedby="file_input_help" id="file_input" name="file_input" type="file" onChange={handleFileSelectAndUpload}></input>
        <p className="mt-1 text-sm font-bold" id="file_input_help">.jpg/.jpeg/.png (MAX 3MB)</p>
      </div>
      
      {/* Username and bio */}
      <form className="mx-auto w-2/5" onSubmit={handleUpdate}>
        <fieldset className="mb-5">
          <label htmlFor="username" className="block mb-2 text-2xl font-bold">Username</label>
          <input className="border-2 border-black shadow-[4px_4px_0px_0px_black] transition-transform duration-150 hover:scale-105 bg-gray-50 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            type="text" id="username" name='username' placeholder={placeHolderUsername} value={formData.username} onChange={handleChange} />
        </fieldset>
        <fieldset className="mb-5">
          <label htmlFor="bio" className="block mb-2 text-2xl font-bold">Bio</label>
          <textarea className="border-2 border-black shadow-[4px_4px_0px_0px_black] transition-transform duration-150 hover:scale-105 block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            id="bio" name="bio" placeholder={placeHolderBio} value={formData.bio} rows={4} onChange={handleChange} ></textarea>
        </fieldset>
        <div className='grid grid-cols-3 gap-4 w-full'>
          <button type="submit" className="border-2 border-black shadow-[4px_4px_0px_0px_black] transition-transform duration-150 hover:scale-105 text-white bg-blue-700 hover:bg-blue-800 font-bold rounded-lg text-md w-full px-5 py-1 text-center">
            Update
          </button>
          <button className="border-2 border-black shadow-[4px_4px_0px_0px_black] transition-transform duration-150 hover:scale-105 text-white bg-yellow-700 hover:bg-yellow-800 font-bold rounded-lg text-md w-full px-5 py-1 text-center"
            type='button' onClick={handleResetPassword}>
            Reset Password
          </button>
          <button className="border-2 border-black shadow-[4px_4px_0px_0px_black] transition-transform duration-150 hover:scale-105 text-white bg-red-700 hover:bg-red-800 font-bold rounded-lg text-md w-full px-5 py-1 text-center"
            type='button' onClick={handleDeleteAccount}>
            Delete Account
          </button>
        </div>
      </form>

      {/* Email */}
      <form className="mx-auto w-2/5 mt-5" onSubmit={handleResetEmail}>
        <fieldset className="mb-5">
          <label htmlFor="new-email" className="block mb-2 text-2xl font-bold">New Email</label>
          <input className="border-2 border-black shadow-[4px_4px_0px_0px_black] transition-transform duration-150 hover:scale-105 bg-gray-50 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            type="email" id="new-email" name='new-email' placeholder={`Current email: ${email}`} onChange={(e) => setNewEmail(e.target.value)} required/>
        </fieldset>
        <button className="border-2 border-black shadow-[4px_4px_0px_0px_black] transition-transform duration-150 hover:scale-105 text-white bg-yellow-700 hover:bg-yellow-800 font-bold rounded-lg text-md w-full sm:w-auto px-5 py-2.5 text-center"
          type='submit'>
          Reset Email
        </button>
      </form>
      
      <h3 className='text-lg font-semibold text-green-600'>
        {isLoading && 'Loading...'}
        {isResetPassword && 'Check your email for password reset link.'}
      </h3>
      {errorMessage && <h3 className='text-lg font-semibold text-red-600'>{errorMessage}</h3>}
    </div>
    </>
  )
}
