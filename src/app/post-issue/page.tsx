'use client'
import { useAuthProvider } from '@/providers/auth-provider';
import RequireSignInSignUp from '@/components/require-signin-signup'
import { Timestamp, addDoc, arrayUnion, collection, doc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { db } from '../firebase';
import MDEditor from '@uiw/react-md-editor';
import rehypeSanitize from "rehype-sanitize";
import { useRouter } from 'next/navigation';
import { NotificationType } from '@/utils/notification-types';
import { useNavbarProvider } from '@/providers/navbar-provider';

type FormDataType = {
  issueReporterUid: string,
  url: string,
  title: string,
  description: string,
  language: string,
  difficulty: string,
  isUrgent: boolean,
  time: Date,
}

export default function PostIssuePage() {
  const [ mounted, setMounted ] = useState<boolean>(false);
  const [ isValidUrl, setIsValidUrl ] = useState<boolean | null>(null);
  const { uid, isVerified } = useAuthProvider();
  const router = useRouter();
  const { height } = useNavbarProvider();
  const navbarHeight = height ?? 64;
  const [ formData, setFormData ] = useState<FormDataType>({
    issueReporterUid: '',
    url: '',
    title: '',
    description: '',
    language: 'C',
    difficulty: 'headache',
    isUrgent: false,
    time: new Date(),
  });

  useEffect(() => {
    setMounted(true);
    if (uid) {
      setFormData((prev) => ({...prev, issueReporterUid: uid}));
    }
  }, [uid]);

  if (!mounted) return null; // Avoid rendering until mounted on client-side

  const handleSubmit = async(e: any) => {
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    e.preventDefault();

    if(urlPattern.test(formData.url)) {
      setIsValidUrl(true);
      
      // Add entry to issues collection
      const docRef = await addDoc(collection(db, "issues"), {
        issueReporterUid: formData.issueReporterUid,
        url: formData.url,
        title: formData.title,
        description: formData.description,
        language: formData.language,
        difficulty: formData.difficulty,
        isUrgent: formData.isUrgent,
        time: Timestamp.fromDate(new Date()),
      });
      
      // Add field to user collection
      const issueId = docRef.id;
      await updateDoc(doc(db, "users", uid), { 
        postedIssues: arrayUnion({
          content: issueId,
          timestamp: Timestamp.fromDate(new Date()),
        }),
        activities: arrayUnion({
          content: issueId,
          type: NotificationType.POST_I,
          timestamp: Timestamp.fromDate(new Date()),
        }),
        "achievementsHelpers.hasPostedIssues": true,
      });

      router.push(`/issues/${issueId}`);
    } else {
      setIsValidUrl(false);
      return;
    }
  }

  const handleChange = (e: any) => {
    if (typeof e === 'string') {
      // Handle <MDEditor> markdown input
      setFormData((prev) => {
        return {
          ...prev,
          description: e,
        }
      });
    } else {
      const { name, value, type, checked } = e.target;
    
      setFormData((prev) => {
        return {
          ...prev,
          [name]: type ? (type === 'checkbox' ? checked : value) : value,
        }
      });
    }
  }
  
  return (
    <>
    {isVerified ? 
      <div className='flex justify-center items-center py-16' >
        <form className="mx-auto w-4/5" onSubmit={handleSubmit}>
          {/* issue url */}
          <fieldset className="mb-5">
            <label className={isValidUrl || isValidUrl === null ? "block mb-2 text-2xl font-bold" :  "block mb-2 text-sm font-medium text-red-600" }
              htmlFor="url" >Issue URL *{isValidUrl || isValidUrl === null ? "" : " (Must be a valid URL)"}</label>
            <input className="bg-gray-50 border-2 border-black shadow-[4px_4px_0px_0px_black] text-gray-900 text-sm rounded-lg block w-full p-2.5" 
              type="text" id="url" name='url' value={formData.url} onChange={handleChange} required />
          </fieldset>
          {/* issue title */}
          <fieldset className="mb-5">
            <label htmlFor="title" className="block mb-2 text-2xl font-bold">Issue Title *</label>
            <input className="bg-gray-50 border-2 border-black shadow-[4px_4px_0px_0px_black] text-gray-900 text-sm rounded-lg block w-full p-2.5" 
              type="text" id="title" name='title' value={formData.title} onChange={handleChange} required />
          </fieldset>
          {/* description */}
          <fieldset className="mb-5">
            <label htmlFor="description" className="block mb-2 text-2xl font-bold">Description</label>
            <div className="container border-2 border-black shadow-[4px_4px_0px_0px_black]" data-color-mode="light">
              <MDEditor
                id="description"
                value={formData.description}
                onChange={handleChange}
                previewOptions={{
                  rehypePlugins: [[rehypeSanitize]],
                }}
              />
            </div>
          </fieldset>
          {/* language, difficulty, urgent */}
          <div className="mb-5 flex flex-row items-center">
            <fieldset className="max-w-sm mx-auto">
              <label htmlFor="language" className="block mb-2 text-2xl font-bold">Language *</label>
              <select className="bg-gray-50 border-2 border-black shadow-[4px_4px_0px_0px_black] text-gray-900 text-sm rounded-lg block w-full p-2.5"
                id="language" name="language" value={formData.language} onChange={handleChange}>
                <option value="C">C</option>
                <option value="C++">C++</option>
                <option value="C#">C#</option>
                <option value="Java">Java</option>
                <option value="PHP">PHP</option>
                <option value="JavaScript">JavaScript</option>
                <option value="TypeScript">TypeScript</option>
                <option value="HTML">HTML</option>
                <option value="CSS">CSS</option>
                <option value="Python">Python</option>
                <option value="Go">Go</option>
                <option value="Ruby">Ruby</option>
                <option value="Rust">Rust</option>
                <option value="Kotlin">Kotlin</option>
                <option value="Swift">Swift</option>
                <option value="Dart">Dart</option>
                <option value="Scala">Scala</option>
                <option value="R">R</option>
                <option value="Perl">Perl</option>
                <option value="Elixir">Elixir</option>
                <option value="Haskell">Haskell</option>
                <option value="Erlang">Erlang</option>
                <option value="Assembly">Assembly</option>
                <option value="Matlab">Matlab</option>
                <option value="Visual Basic">Visual Basic</option>
                <option value="SQL">SQL</option>
                <option value="Lua">Lua</option>
                <option value="Others">Others</option>
              </select>
            </fieldset>

            <fieldset className="max-w-sm mx-auto">
              <label htmlFor="difficulty" className="block mb-2 text-2xl font-bold">Difficulty *</label>
              <select id="difficulty" name="difficulty" value={formData.difficulty} onChange={handleChange} className="bg-gray-50 border-2 border-black shadow-[4px_4px_0px_0px_black] text-gray-900 text-sm rounded-lg block w-full p-2.5">
                <option value='headache'>Headache</option>
                <option value='easy-fix'>Easy Fix</option>
              </select>
            </fieldset>

            <fieldset className="flex items-center mx-auto">
              <input className="w-4 h-4 text-blue-600 bg-gray-100 border-2 border-black shadow-[4px_4px_0px_0px_black] rounded-sm" 
                type="checkbox" id="isUrgent" name="isUrgent" checked={formData.isUrgent} onChange={handleChange} ></input>
              <label htmlFor="isUrgent" className="ms-2 text-2xl font-bold">Urgent</label>
            </fieldset>

            <fieldset className='mx-auto'>
              <button type="submit" className="border-2 border-black shadow-[4px_4px_0px_0px_black] transition-transform duration-150 hover:scale-105 text-white bg-blue-700 hover:bg-blue-800 rounded-lg text-2xl font-bold w-full sm:w-auto px-5 py-2.5 text-center">Submit</button>
            </fieldset>
          </div>
        </form>
      </div> :
      <RequireSignInSignUp target='Post an Issue' />
    }
    </>
  )
}
