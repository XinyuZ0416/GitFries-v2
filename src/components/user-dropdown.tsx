'use client'
import React from 'react'
import { auth } from '@/app/firebase';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useAuthProvider } from '../providers/auth-provider';
import Link from 'next/link';

export default function UserDropdown() {
  const router = useRouter();
  const { uid, setUid, setIsVerified, userPicUrl } = useAuthProvider();

  const handleSignOut = async() => {
    try {
      await signOut(auth);
      setUid('');
      setIsVerified(false);
      router.push('/');
    }catch(error) {
      console.error(error);
    }
  }

  return (
    <>
    <Menu>
      <MenuButton className="shrink-0">
        {userPicUrl && <img className="border-2 border-black rounded-full h-9" src={userPicUrl} alt="user profile" />}
      </MenuButton>

      <MenuItems
        transition
        anchor="bottom"
        className="border-4 border-black shadow-[4px_4px_0px_0px_black] z-10 bg-white rounded-lg w-fit"
      >
        <MenuItem>
          <Link href={`/profile/${uid}`} className="transition-transform duration-150 hover:scale-125 font-bold border-b-2 border-black group flex w-full items-center justify-center py-1.5 px-3">
            Profile
          </Link>
        </MenuItem>
        <MenuItem>
          <Link href="/settings" className="transition-transform duration-150 hover:scale-125 font-bold border-b-2 border-black group flex w-full items-center justify-center py-1.5 px-3">
            Settings
          </Link>
        </MenuItem>
        <MenuItem>
          <button onClick={handleSignOut} className="transition-transform duration-150 hover:scale-125 font-bold group flex w-full items-center justify-center py-1.5 px-3">
            Sign Out
          </button>
        </MenuItem>
      </MenuItems>
    </Menu> 
    </>
  )
}
