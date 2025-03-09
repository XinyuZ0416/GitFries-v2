'use client'
import React from 'react'
import Searchbar from './searchbar'
import UserDropdown from './user-dropdown'
import { useAuth } from './providers';

export default function Navbar() {
  const { uid } = useAuth();

  return (
    <>
    <nav className="bg-yellow-300 sticky top-0 z-10">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-2">
        <a href="/" className="flex items-center space-x-3">
          <img src="/logo.png" className="h-8" alt="GitFries Logo" />
          <img src="https://see.fontimg.com/api/rf5/Yz9Ga/YWE2ZTFiNmIzODBjNGY5ZGJkYWU2Zjc4ODRjZTdiMDgub3Rm/R2l0RnJpZXM/flying-bird.png?r=fs&h=130&w=2000&fg=D00B0B&bg=FFFFFF&tb=1&s=65" className="h-8" alt="GitFries Title Logo" />
        </a>
      
        <div className="items-center justify-between w-full md:flex md:w-auto" id="navbar-search">
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0">
            <li>
              <a href="/issues" className="block py-2 px-3 brounded-sm md:bg-transparent md:p-0" aria-current="page">Issues</a>
            </li>
            <li>
              <a href="/dashboard" className="block py-2 px-3 rounded-sm md:hover:bg-transparent md:p-0 md:dark:hover:bg-transparent">Dashboard</a>
            </li>
            <li>
              <a href="/achievements" className="block py-2 px-3 rounded-sm md:hover:bg-transparent md:p-0 md:dark:hover:bg-transparent">Achievements</a>
            </li>
          </ul>
        </div>
        
        <Searchbar />

        <a href="/post-issue" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none">Post an issue</a>

        { // if user is logged in
          uid && 
          <>
          <a href='/notifications'>
            <img src="/notification.png" className="h-8" alt="no notification" />
          </a>
          <UserDropdown />
          </>
        }
        
        { // if user is logged out
          !uid && 
          <>
          <a href="/sign-in" className="hover:underline">Sign In</a>
          <a href="/sign-up" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none">Sign Up</a>
          </>
        }
      </div>
    </nav>
    </>
  )
}
