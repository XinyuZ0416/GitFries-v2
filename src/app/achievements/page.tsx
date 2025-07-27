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
    <h2 className="text-7xl font-bold text-center my-10">All Achievements</h2>
    <div className="grid grid-flow-col grid-rows-3 grid-cols-3 gap-10 m-10">
      <Badge src={`/achievements/${ signedIn && freshStarter.achieved ? "colorful" : "brown"}/fresh-starter.png`} alt='Fresh Starter' title='Fresh Starter' 
        description='Planted the seed, now watch it grow.' explanation='Claimed and finished their first issue' />
      <Badge src={`/achievements/${ signedIn && firstDetonation.achieved ? "colorful" : "brown"}/first-detonation.png`} alt='First Detonation' title='First Detonation' 
        description='Found the bug. Pulled the pin. Walked away in slow motion.' explanation='Posted their first issue' />
      <Badge src={`/achievements/${ signedIn && issueHoarder.achieved ? "colorful" : "brown"}/issue-hoarder.png`} alt='Issue Hoarder' title='Issue Hoarder' 
        description='If I hoarded it, I solved it!' explanation='Favorited 20 issues' />
      <Badge src={`/achievements/${ signedIn && bugDestroyer.achieved ? "colorful" : "brown"}/bug-destroyer.png`} alt='Bug Destroyer' title='Bug Destroyer' 
        description='What bugs?' explanation='Finished 10 issues' />
      <Badge src={`/achievements/${ signedIn && commentGoblin.achieved ? "colorful" : "brown"}/comment-goblin.png`} alt='Comment Goblin' title='Comment Goblin' 
        description='Lives in the comment section. Probably.' explanation='Left 50 comments' />
      <Badge src={`/achievements/${ signedIn && mergeMonarch.achieved ? "colorful" : "brown"}/merge-monarch.png`} alt='Merge Monarch' title='Merge Monarch' 
        description='All commits bow to your will!' explanation='Received 10 requests to approve finished issues' />
      <Badge src={`/achievements/${ signedIn && issueFisher.achieved ? "colorful" : "brown"}/issue-fisher.png`} alt='Issue Fisher' title='Issue Fisher' 
        description='Baited the hook, and the coders came biting.' explanation='Received 10 requests to approve claimed issues' />
      <Badge src={`/achievements/${ signedIn && speedyGonzales.achieved ? "colorful" : "brown"}/speedy-gonzales.png`} alt='Speedy Gonzales' title='Speedy Gonzales' 
        description='No fix too quick.' explanation="Finished an issue within an hour after it's posted" />
      <Badge src={`/achievements/${ signedIn && timeTraveller.achieved ? "colorful" : "brown"}/time-traveller.png`} alt='Time Traveller' title='Time Traveller' 
        description='They’re here to fix the past.' explanation="Finished an issue a year after it's posted" />
    </div>
    </>
  )
}
