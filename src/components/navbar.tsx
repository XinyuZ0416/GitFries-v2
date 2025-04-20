'use client'
import React from 'react'
import Searchbar from './searchbar'
import UserDropdown from './user-dropdown'
import { useAuthProvider } from '../providers/auth-provider';
import Link from 'next/link';
import { useCurrentUserDocProvider } from '@/providers/current-user-doc-provider';
import { useChatProvider } from '@/providers/chat-provider';

export default function Navbar() {
  const { isVerified } = useAuthProvider();
  const { unreadNotif } = useCurrentUserDocProvider();
  const { openChat, chats } = useChatProvider();

  return (
    <>
    <nav className="bg-yellow-300 sticky top-0 z-10">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-2">
        <Link href="/" className="flex items-center space-x-3">
          <img src="/logo.png" className="h-8" alt="GitFries Logo" />
          <img src="https://see.fontimg.com/api/rf5/Yz9Ga/YWE2ZTFiNmIzODBjNGY5ZGJkYWU2Zjc4ODRjZTdiMDgub3Rm/R2l0RnJpZXM/flying-bird.png?r=fs&h=130&w=2000&fg=D00B0B&bg=FFFFFF&tb=1&s=65" className="h-8" alt="GitFries Title Logo" />
        </Link>
      
        <div className="items-center justify-between w-full md:flex md:w-auto" id="navbar-search">
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0">
            <li>
              <Link href="/issues" className="block py-2 px-3 brounded-sm md:bg-transparent md:p-0" aria-current="page">Issues</Link>
            </li>
            <li>
              <Link href="/achievements" className="block py-2 px-3 rounded-sm md:hover:bg-transparent md:p-0 md:dark:hover:bg-transparent">Achievements</Link>
            </li>
            {isVerified && // if user is logged in & verified
              <li>
                <Link href="/membership" className="block py-2 px-3 rounded-sm md:hover:bg-transparent md:p-0 md:dark:hover:bg-transparent">Membership</Link>
              </li>}
          </ul>
        </div>
        
        <Searchbar />

        <Link href="/post-issue" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none">Post an issue</Link>

        {isVerified && // if user is logged in & verified
          <>
          <Link href='/notifications'>
            <img src={unreadNotif.length > 0 ? "/notification-new.png" : "/notification.png"} className="h-8" alt="notification" />
          </Link>
          <button onClick={() => openChat()}>
            <img src={chats && Object.keys(chats).length !== 0 ? "/chats-new.png" : "/chats.png"} className="h-8" alt="chats" />
          </button>
          <UserDropdown />
          </>}
        
        {isVerified !== null && !isVerified && // if user is logged out or not verified
          <>
          <Link href="/sign-in" className="hover:underline">Sign In</Link>
          <Link href="/sign-up" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none">Sign Up</Link>
          </>}
      </div>
    </nav>
    </>
  )
}
