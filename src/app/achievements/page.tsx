'use client'
import Badge from '@/components/achievements/badge'
import { useAuthProvider } from '@/providers/auth-provider'
import RequireSignInSignUp from '@/components/require-signin-signup'
import React from 'react'

export default function AchievementsPage() {
  const { isVerified } = useAuthProvider();  
  return (
    <>
    <h2 className="text-2xl font-bold">All Achievements</h2>
    <div className="grid grid-flow-col grid-rows-3 gap-4">
      <Badge src='/fresh-starter.png' alt='fresh starter' title='fresh starter' 
        description='Planted the seed, now watch it grow.' explanation='Claims and finishes their first issue' />
      <Badge src='/first-detonation.png' alt='first detonation' title='first detonation' 
        description='Found the bug. Pulled the pin. Walked away in slow motion.' explanation='Posts their first issue' />
      <Badge src='/issue-hoarder.png' alt='issue hoarder' title='issue hoarder' 
        description='If I hoarded it, I solved it!' explanation='Favorites 20 issues' />
      <Badge src='/bug-destroyer.png' alt='bug destroyer' title='bug destroyer' 
        description='What bugs?' explanation='Finishes 10 issues' />
      <Badge src='/comment-goblin.png' alt='comment goblin' title='comment goblin' 
        description='Lives in the comment section. Probably.' explanation='Leaves 50 comments' />
      <Badge src='/merge-monarch.png' alt='merge monarch' title='merge monarch' 
        description='All commits bow to your will!' explanation='Receives 10 requests to approve finished issues' />
      <Badge src='/issue-fisher.png' alt='issue fisher' title='issue fisher' 
        description='Baited the hook, and the coders came biting.' explanation='Receives 10 requests to approve claimed issues' />
      <Badge src='/speedy-gonzales.png' alt='speedy gonzales' title='speedy gonzales' 
        description='No fix too quick.' explanation="Finishes an issue within an hour after it's posted" />
      <Badge src='/time-traveller.png' alt='time traveller' title='time traveller' 
        description='They’re here to fix the past.' explanation='Solves an issue that’s been posted for over a year' />
    </div>
    {isVerified ? 
      <h2 className="text-2xl font-bold">My Achievements</h2> :
      <RequireSignInSignUp target='See Your Own Achievements' />
    }
    </>
  )
}
