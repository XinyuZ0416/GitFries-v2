import PricingFreeCard from '@/components/pricing-free-card'
import PricingSvipCard from '@/components/pricing-svip-card'
import PricingVipCard from '@/components/pricing-vip-card'
import React from 'react'

export default function MembershipPage() {
  return (
    <>
    <div className='flex flex-row w-full h-screen justify-around items-center'>
      <PricingFreeCard />
      <PricingVipCard />
      <PricingSvipCard />
    </div>
    </>
  )
}
