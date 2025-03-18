'use client'
import Badge from '@/components/badge'
import { useAuth } from '@/providers/auth-provider'
import RequireSignInSignUp from '@/components/require-signin-signup'
import React from 'react'

export default function AchievementsPage() {
  const { isVerified } = useAuth();  
  return (
    <>
    <h2 className="text-2xl font-bold">All Achievements</h2>
    <div className="grid grid-flow-col grid-rows-3 gap-4">
      <Badge src='/issue-hoarder.png' alt='issue hoarder' title='Issue Hoarder' description='If I hoarded it, I solved it' />
      <Badge src='/issue-hoarder.png' alt='issue hoarder' title='Issue Hoarder' description='If I hoarded it, I solved it' />
      <Badge src='/issue-hoarder.png' alt='issue hoarder' title='Issue Hoarder' description='If I hoarded it, I solved it' />
      <Badge src='/issue-hoarder.png' alt='issue hoarder' title='Issue Hoarder' description='If I hoarded it, I solved it' />
      <Badge src='/issue-hoarder.png' alt='issue hoarder' title='Issue Hoarder' description='If I hoarded it, I solved it' />
      <Badge src='/issue-hoarder.png' alt='issue hoarder' title='Issue Hoarder' description='If I hoarded it, I solved it' />
      <Badge src='/issue-hoarder.png' alt='issue hoarder' title='Issue Hoarder' description='If I hoarded it, I solved it' />
      <Badge src='/issue-hoarder.png' alt='issue hoarder' title='Issue Hoarder' description='If I hoarded it, I solved it' />
      <Badge src='/issue-hoarder.png' alt='issue hoarder' title='Issue Hoarder' description='If I hoarded it, I solved it' />
      <Badge src='/issue-hoarder.png' alt='issue hoarder' title='Issue Hoarder' description='If I hoarded it, I solved it' />
      <Badge src='/issue-hoarder.png' alt='issue hoarder' title='Issue Hoarder' description='If I hoarded it, I solved it' />
      <Badge src='/issue-hoarder.png' alt='issue hoarder' title='Issue Hoarder' description='If I hoarded it, I solved it' />
      <Badge src='/issue-hoarder.png' alt='issue hoarder' title='Issue Hoarder' description='If I hoarded it, I solved it' />
      <Badge src='/issue-hoarder.png' alt='issue hoarder' title='Issue Hoarder' description='If I hoarded it, I solved it' />
      <Badge src='/issue-hoarder.png' alt='issue hoarder' title='Issue Hoarder' description='If I hoarded it, I solved it' />
    </div>
    {isVerified ? 
      <h2 className="text-2xl font-bold">My Achievements</h2> :
      <RequireSignInSignUp target='See Your Own Achievements' />
    }
    </>
  )
}
