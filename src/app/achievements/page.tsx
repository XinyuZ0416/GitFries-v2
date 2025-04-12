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
      <Badge src='/first-detonation.png' alt='first detonation' title='first detonation' 
        description='Found the bug. Pulled the pin. Walked away in slow motion.' explanation='Posts their first issue' />
      <Badge src='/issue-hoarder.png' alt='issue hoarder' title='issue hoarder' 
        description='If I hoarded it, I solved it!' explanation='Favorites 20 issues' />
      <Badge src='/bug-destroyer.png' alt='bug destroyer' title='bug destroyer' 
        description='What bugs?' explanation='Finishes 10 issues' />
      <Badge src='/comment-goblin.png' alt='comment goblin' title='comment goblin' 
        description='Lives in the comment section. Probably.' explanation='Leaves 50 comments' />
      <Badge src='/bug-whisperer.png' alt='bug whisperer' title='bug whisperer' 
        description='I speak in fluent bugs.' explanation='Leaves a issue unfinished > 30 days' />
      
      <Badge src='/issue-fisher.png' alt='issue fisher' title='issue fisher' 
        description='Baited the hook, and the coders came biting.' explanation='Posts 10 issues and all get calimed' />
      <Badge src='/merge-monarch.png' alt='merge monarch' title='merge monarch' 
        description='All commits bow to your will!' explanation='Gets 10 requests to approve finished issues' />
      <Badge src='/speedy-gonzales.png' alt='speedy gonzales' title='speedy gonzales' 
        description='No fix too quick.' explanation='Finishes an issue in under an hour' />
      <Badge src='/ghost-claimer.png' alt='ghost claimer' title='ghost claimer' 
        description='I ghost, therefore I am.' explanation='Claims 10 issues but never finishes any' />
      <Badge src='/fresh-starter.png' alt='fresh starter' title='fresh starter' 
        description='Planted the seed, now watch it grow.' explanation='Claims and finishes their first issue' />
      <Badge src='/rejected-never.png' alt='rejected never' title='rejected never' 
        description='Never take no for an answer. Well, not without trying again.' explanation='Request to claim an issue is rejected' />
      <Badge src='/time-travelr.png' alt='time travelr' title='time travelr' 
        description='They’re here to fix the past.' explanation='Solves an issue that’s been posted for over a year' />
    </div>
    {isVerified ? 
      <h2 className="text-2xl font-bold">My Achievements</h2> :
      <RequireSignInSignUp target='See Your Own Achievements' />
    }
    </>
  )
}
