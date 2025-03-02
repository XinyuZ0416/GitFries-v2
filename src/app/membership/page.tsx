import PricingFreeCard from '@/components/pricing-free-card'
import PricingNineCard from '@/components/pricing-nine-card'
import PricingOneCard from '@/components/pricing-one-card'
import React from 'react'

export default function MembershipPage() {
  return (
    <>
    <PricingFreeCard />
    <PricingOneCard />
    <PricingNineCard />
    </>
  )
}
