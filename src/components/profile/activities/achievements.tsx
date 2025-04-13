import React from 'react'

interface ActivitiesAchievementsCardProps {
  src: string,
  alt: string,
  picTitle: string,
  title: string,
}

export default function ActivitiesAchievementsCard({
  src,
  alt,
  picTitle,
  title
}: ActivitiesAchievementsCardProps) {
  return (
    <>
    <div className='flex flex-col justify-center items-center'>
      <img className='size-14' src={src} alt={alt} title={picTitle} />
      <h4 className="text-m font-bold text-center">{title}</h4>
    </div>
    </>
  )
}
