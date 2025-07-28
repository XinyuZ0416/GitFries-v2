'use client'
import React from 'react'

interface BadgeProps {
  src: string,
  alt: string,
  title: string,
  description: string,
  explanation: string,
}

export default function Badge({src, alt, title, description, explanation}: BadgeProps) {
  return (
    <>
    <div className='border-2 border-black shadow-[4px_4px_0px_0px_black] transition-transform duration-150 hover:scale-105 rounded-lg bg-white p-4 flex flex-col justify-center items-center'>
      <img className='size-40' src={src} alt={alt} />
      <h2 className="text-2xl font-bold text-yellow-700">{title}</h2>
      <p className="font-bold text-center text-yellow-500">{description}</p>
      <h4 className="text-sm font-bold text-white">{explanation}</h4>
    </div>
    </>
  )
}