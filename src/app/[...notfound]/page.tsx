'use client';

import { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';


export default function CatchAll(props: { params: Promise<{ notfound?: string[] }> }) {
  const router = useRouter();
  const { notfound } = use(props.params);
  const attemptedPath = '/' + (notfound?.join('/') || '');

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        router.push('/');
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [router]);

  return (
    <>
    <div className='not-found-page flex justify-center items-center h-screen'>
      <div className="p-6 bg-black/90 flex-col items-start w-1/2 rounded-3xl">
        <p className="mt-2 text-white">
          <span className="text-yellow-400">$</span>{" "}
          <span className="text-red-600">curl</span>{" "}
          https://www.gitfries.com{attemptedPath}
        </p>
        <p className="mt-2 text-white">
          <span className="text-red-600">404:</span> no such path: {attemptedPath}
        </p>
        <p className="mt-4 text-white">
          hit <span className="text-blue-400 underline cursor-pointer" onClick={() => router.push('/')}>return</span> to continue
        </p>
      </div>
    </div>
    </>
  );
}
