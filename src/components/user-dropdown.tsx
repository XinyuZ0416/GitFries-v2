'use client'
import React from 'react'
import { auth } from '@/app/firebase';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useAuth } from './providers';
import Link from 'next/link';

export default function UserDropdown() {
  const router = useRouter();
  const { setUid, setIsVerified } = useAuth();

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
        <img className="rounded-full h-8" src="/potato.png" alt="user profile" />
      </MenuButton>

      <MenuItems
        transition
        anchor="bottom"
        className="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-fit"
      >
        <MenuItem>
          <Link href='/profile' type='button' className="group flex w-full items-center justify-center rounded-lg py-1.5 px-3">Profile</Link>
        </MenuItem>
        <MenuItem>
          <Link href='/membership' type='button' className="group flex w-full items-center justify-center rounded-lg py-1.5 px-3">Membership</Link>
        </MenuItem>
        <MenuItem>
          <Link href='/settings' type='button' className="group flex w-full items-center justify-center rounded-lg py-1.5 px-3">Settings</Link>
        </MenuItem>
        <MenuItem>
          <button type='button' onClick={handleSignOut} className="group flex w-full items-center justify-center rounded-lg py-1.5 px-3">
            Sign Out
          </button>
        </MenuItem>
      </MenuItems>
    </Menu> 
    </>
  )
}
