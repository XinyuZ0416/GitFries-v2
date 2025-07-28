'use client'
import React, { useState } from 'react'
import Searchbar from './searchbar'
import UserDropdown from './user-dropdown'
import { useAuthProvider } from '../providers/auth-provider';
import Link from 'next/link';
import { useCurrentUserDocProvider } from '@/providers/current-user-doc-provider';
import { useChatProvider } from '@/providers/chat-provider';
import { useNavbarProvider } from '@/providers/navbar-provider';

export default function Navbar() {
  const { isVerified } = useAuthProvider();
  const { unreadNotif } = useCurrentUserDocProvider();
  const { openChat, chats } = useChatProvider();
  const { navbarRef } = useNavbarProvider();
  const [isHamburgerOpen, setIsHamburgerOpen] = useState<boolean>(false);

  const handleHamburgerClick = () => {
    setIsHamburgerOpen(prev => !prev);
  }

  return (
    <>
      <nav className="bg-yellow-300 sticky top-0 z-10" ref={navbarRef}>
        <div className="max-w-screen-xl flex flex-nowrap items-center justify-between mx-auto p-2">
          <Link href="/" className="flex items-center space-x-3 transition-transform duration-150 hover:scale-105">
            <img src="/logo.png" className="h-8" alt="GitFries Logo" />
            <img src="https://see.fontimg.com/api/rf5/Yz9Ga/YWE2ZTFiNmIzODBjNGY5ZGJkYWU2Zjc4ODRjZTdiMDgub3Rm/R2l0RnJpZXM/flying-bird.png?r=fs&h=130&w=2000&fg=D00B0B&bg=FFFFFF&tb=1&s=65" className="h-8" alt="GitFries Title Logo" />
          </Link>
          
          {/* Mobile burger menu (only shows on mobile) */}
          <div className='flex md:hidden'>
            <button onClick={handleHamburgerClick}>
              {isHamburgerOpen ? 
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg> : 
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              }
            </button>
          </div>
        
          {/* Menu items (default visible on desktop) */}
          <div className="items-center justify-between w-full hidden md:flex md:w-auto" id="navbar-search">
            <ul className="flex flex-col md:space-x-6 md:flex-row md:mt-0 md:border-0">
              <li className='px-3'>
                <Link href="/issues" className="font-bold block md:bg-transparent md:p-0 transition-transform duration-150 hover:scale-125" aria-current="page">Issues</Link>
              </li>
              <li className='px-3'>
                <Link href="/achievements" className="font-bold block md:bg-transparent md:p-0 transition-transform duration-150 hover:scale-125">Achievements</Link>
              </li>
              {isVerified && // if user is logged in & verified
                <li className='px-3'>
                  <Link href="/membership" className="font-bold block md:bg-transparent md:p-0 transition-transform duration-150 hover:scale-125">Membership</Link>
                </li>}
            </ul>
          </div>
          
          {/* Search bar (default visible on desktop) */}
          <div className='hidden md:inline-block w-52 transition-transform duration-150 hover:scale-105'>
            <Searchbar />
          </div>
          
          {/* Post issue button (default visible on desktop) */}
          <Link href="/post-issue" className="py-2.5 hidden md:inline-block">
            <div className='flex items-center px-3 font-bold transition-transform duration-150 hover:scale-125'>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              Post Issue
            </div>
          </Link>
          
          {/* Notifications, chats and user dropdown (default visible on desktop) */}
          {isVerified && // if user is logged in & verified
            <div className='hidden md:flex items-center flex-shrink-0 gap-10'>
              <Link href='/notifications' className='transition-transform duration-150 hover:scale-125'>
                <img src={unreadNotif.length > 0 ? "/notification-new.png" : "/notification.png"} className="h-8" alt="notification" />
              </Link>
              <button onClick={() => openChat()} className='transition-transform duration-150 hover:scale-125'>
                <img src={chats && Object.keys(chats).length !== 0 ? "/chats-new.png" : "/chats.png"} className="h-8" alt="chats" />
              </button>
              <div className='transition-transform duration-150 hover:scale-125 flex justify-center'>
                <UserDropdown />
              </div>
            </div>
          }
          
          {/* Sign in and sign up (default visible on desktop) */}
          {isVerified !== null && !isVerified && // if user is logged out or not verified
            <div className='hidden md:flex gap-10 items-center'>
              <Link href="/sign-in" className="transition-transform duration-150 hover:scale-125 font-bold ">Sign In</Link>
              <Link href="/sign-up" className="transition-transform duration-150 hover:scale-105 border-2 border-black shadow-[4px_4px_0px_0px_black] text-white bg-blue-700 hover:bg-blue-800 font-bold rounded-lg text-sm px-5 py-2.5">
                Sign Up
              </Link>
            </div>
          }
        </div>

        {/* Mobile menu items (shown when hamburger is clicked) */}
        {isHamburgerOpen && (
          <div className="md:hidden w-full">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Mobile Searchbar */}
              <div className="px-2">
                <Searchbar />
              </div>
              
              {/* Navigation Links */}
              <Link 
                href="/issues" 
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-yellow-400"
                onClick={() => setIsHamburgerOpen(false)}
              >
                Issues
              </Link>
              <Link 
                href="/achievements" 
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-yellow-400"
                onClick={() => setIsHamburgerOpen(false)}
              >
                Achievements
              </Link>
              {isVerified && (
                <Link 
                  href="/membership" 
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-yellow-400"
                  onClick={() => setIsHamburgerOpen(false)}
                >
                  Membership
                </Link>
              )}
              
              {/* Post Issue Button */}
              <Link 
                href="/post-issue" 
                className="flex items-center px-3 py-2 rounded-md text-base font-medium hover:bg-yellow-400"
                onClick={() => setIsHamburgerOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5 mr-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                Post Issue
              </Link>
              
              {/* Auth Section */}
              {isVerified ? (
                <div className="pt-4 border-t border-yellow-400">
                  <div className="flex justify-evenly space-x-4 px-3">
                    <Link 
                      href="/notifications" 
                      className="flex-shrink-0"
                      onClick={() => setIsHamburgerOpen(false)}
                    >
                      <img src={unreadNotif.length > 0 ? "/notification-new.png" : "/notification.png"} className="h-6" alt="notification" />
                    </Link>
                    <button 
                      onClick={() => {
                        openChat();
                        setIsHamburgerOpen(false);
                      }}
                      className="flex-shrink-0"
                    >
                      <img src={chats && Object.keys(chats).length !== 0 ? "/chats-new.png" : "/chats.png"} className="h-6" alt="chats" />
                    </button>
                    <UserDropdown mobile onClose={() => setIsHamburgerOpen(false)} />
                  </div>
                </div>
              ) : (
                <div className="pt-4 border-t border-yellow-400 space-y-2">
                  <Link 
                    href="/sign-in" 
                    className="block w-full text-center px-3 py-2 rounded-md text-base font-medium hover:bg-yellow-400"
                    onClick={() => setIsHamburgerOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link 
                    href="/sign-up" 
                    className="block w-full text-center text-white bg-blue-700 hover:bg-blue-800 px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsHamburgerOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  )
}