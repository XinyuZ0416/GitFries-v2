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
    <div className='rounded-lg shadow-sm bg-white p-4 flex flex-col items-center'>
      <img className='size-40' src={src} alt={alt} />
      <h2 className="text-2xl font-bold">{title}</h2>
      <p className="font-normal">{description}</p>
      <h4 className="text-sm text-gray-400">{explanation}</h4>
    </div>
    </>
  )
}