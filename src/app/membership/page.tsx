import PricingFreeCard from '@/components/pricing/free'
import PricingSvipCard from '@/components/pricing/svip'
import PricingVipCard from '@/components/pricing/vip'
import React from 'react'

export default function MembershipPage() {
  return (
    <>
    Payment cannot be refunded and plans will not auto renew
    <div className='flex flex-row w-full h-screen justify-around items-center'>
      <PricingFreeCard />
      <PricingVipCard />
      <PricingSvipCard />
    </div>
    </>
  )
}
