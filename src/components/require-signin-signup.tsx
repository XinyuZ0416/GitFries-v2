import { useNavbarProvider } from '@/providers/navbar-provider';
import Link from 'next/link'
import React from 'react'

interface RequireSignInSignUpProps {
  target: string
}

export default function RequireSignInSignUp({target}: RequireSignInSignUpProps) {
  const { height } = useNavbarProvider();
  const navbarHeight = height ?? 64;
    
  return (
    <>
    <div style={{ height: `calc(100vh - ${navbarHeight}px)` }} className="flex flex-col h-screen justify-center items-center">
      <h1 className="text-4xl font-bold text-center">
        <span className="inline-block align-middle">
          <Link href="/sign-in" className="underline">Sign In</Link>
        </span> or 
        <span className="inline-flex align-middle ml-2">
          <Link href="/sign-up" className="transition-transform duration-150 hover:scale-105 border-4 border-black shadow-[4px_4px_0px_0px_black] text-white bg-blue-700 hover:bg-blue-800 font-bold rounded-lg text-xl px-5 py-2.5">
            Sign Up
          </Link>
        </span> to {target}
      </h1>
    </div>
    </>
  )
}
