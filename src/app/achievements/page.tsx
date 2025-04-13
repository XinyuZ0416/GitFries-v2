'use client'
import Badge from '@/components/achievements/badge'
import { useAuthProvider } from '@/providers/auth-provider'
import React, { useEffect, useState } from 'react'
import { useAchievementsProvider } from '@/providers/achievements-provider'

export default function AchievementsPage() {
  const [ signedIn, setSignedIn ] = useState<boolean>(false);
  const { isVerified, uid } = useAuthProvider();
  const { 
    freshStarter,
    firstDetonation,
    issueHoarder,
    bugDestroyer,
    commentGoblin,
    mergeMonarch,
    issueFisher,
    speedyGonzales,
    timeTraveller 
  } = useAchievementsProvider();

  useEffect(() => {
    if (isVerified && uid) {
      setSignedIn(true);
    }
  }, [isVerified, uid]);

  return (
    <>
    <h2 className="text-2xl font-bold">All Achievements</h2>
    <div className="grid grid-flow-col grid-rows-3 gap-4">
      <Badge src={`/achievements/${ signedIn && freshStarter.achieved ? "colorful" : "brown"}/fresh-starter.png`} alt='fresh starter' title='fresh starter' 
        description='Planted the seed, now watch it grow.' explanation='Claims and finishes their first issue' />
      <Badge src={`/achievements/${ signedIn && firstDetonation.achieved ? "colorful" : "brown"}/first-detonation.png`} alt='first detonation' title='first detonation' 
        description='Found the bug. Pulled the pin. Walked away in slow motion.' explanation='Posts their first issue' />
      <Badge src={`/achievements/${ signedIn && issueHoarder.achieved ? "colorful" : "brown"}/issue-hoarder.png`} alt='issue hoarder' title='issue hoarder' 
        description='If I hoarded it, I solved it!' explanation='Favorites 20 issues' />
      <Badge src={`/achievements/${ signedIn && bugDestroyer.achieved ? "colorful" : "brown"}/bug-destroyer.png`} alt='bug destroyer' title='bug destroyer' 
        description='What bugs?' explanation='Finishes 10 issues' />
      <Badge src={`/achievements/${ signedIn && commentGoblin.achieved ? "colorful" : "brown"}/comment-goblin.png`} alt='comment goblin' title='comment goblin' 
        description='Lives in the comment section. Probably.' explanation='Leaves 50 comments' />
      <Badge src={`/achievements/${ signedIn && mergeMonarch.achieved ? "colorful" : "brown"}/merge-monarch.png`} alt='merge monarch' title='merge monarch' 
        description='All commits bow to your will!' explanation='Receives 10 requests to approve finished issues' />
      <Badge src={`/achievements/${ signedIn && issueFisher.achieved ? "colorful" : "brown"}/issue-fisher.png`} alt='issue fisher' title='issue fisher' 
        description='Baited the hook, and the coders came biting.' explanation='Receives 10 requests to approve claimed issues' />
      <Badge src={`/achievements/${ signedIn && speedyGonzales.achieved ? "colorful" : "brown"}/speedy-gonzales.png`} alt='speedy gonzales' title='speedy gonzales' 
        description='No fix too quick.' explanation="Finishes an issue within an hour after it's posted" />
      <Badge src={`/achievements/${ signedIn && timeTraveller.achieved ? "colorful" : "brown"}/time-traveller.png`} alt='time traveller' title='time traveller' 
        description='They’re here to fix the past.' explanation="Finishes an issue a year after it's posted" />
    </div>
    </>
  )
}
