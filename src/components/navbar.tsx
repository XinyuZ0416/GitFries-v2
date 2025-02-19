import React from 'react'

export default function Navbar() {
  return (
    <>
    <nav className="bg-yellow-300">
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
          </ul>
        </div>
        
        <div className="flex">
          <button type="button" data-collapse-toggle="navbar-search" aria-controls="navbar-search" aria-expanded="false" className="md:hidden text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5 me-1">
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
            <span className="sr-only">Search</span>
          </button>
          <div className="relative hidden md:block">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
              </svg>
              <span className="sr-only">Search icon</span>
            </div>
            <input type="text" id="search-navbar" className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Find an issue..."></input>
          </div>
          <button data-collapse-toggle="navbar-search" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-search" aria-expanded="false">
              <span className="sr-only">Open main menu</span>
              <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
              </svg>
          </button>
        </div>

        <a href="/sign-in" className="hover:underline">Sign In</a>
        
        <a href="/sign-up" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none">Sign Up</a>
      </div>
    </nav>
    </>
  )
}
