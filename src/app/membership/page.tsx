'use client'
import PricingFreeCard from '@/components/pricing/free'
import PricingSvipCard from '@/components/pricing/svip'
import PricingVipCard from '@/components/pricing/vip'
import { useNavbarProvider } from '@/providers/navbar-provider';
import React from 'react'

export default function MembershipPage() {
  const { height } = useNavbarProvider();
  const navbarHeight = height ?? 64;
  return (
    <>
    <h2 className="text-7xl font-bold text-center mt-10">Pick a Plan</h2>
    <div className='flex flex-row w-full justify-around items-center' style={{ height: `calc(100vh - ${navbarHeight}px)` }}>
      <PricingFreeCard />
      <PricingVipCard />
      <PricingSvipCard />
    </div>
    </>
  )
}
