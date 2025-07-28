import React, { useState } from 'react'

export default function FeatureIntro() {
  const [ selectedFeature, setSelectedFeature ] = useState<string>('');

  const handleClick = (feature: string) => {
    setSelectedFeature(feature);
  }
  
  const renderImage = () => {
  if (!selectedFeature) return null;

  const imageMap: Record<string, { src: string; alt: string }> = {
    post: { src: '/feature-intro/post-issue.png', alt: 'post issue demo' },
    claim: { src: '/feature-intro/claim-issue.png', alt: 'claim issue demo' },
    badges: { src: '/feature-intro/win-badges.png', alt: 'win badges demo' },
    growth: { src: '/feature-intro/track-growth.png', alt: 'track growth demo' },
  };

  const { src, alt } = imageMap[selectedFeature];

  return (
    <div key={selectedFeature} className="opacity-0 animate-fadeIn rounded-xl border-2 border-black shadow-[5px_5px_0px_0px_black]">
      <img src={src} alt={alt} className='max-w-screen-lg w-full object-contain rounded-xl shadow-lg'/>
    </div>
  );
};



  return (
    <>
    <div className='flex flex-col gap-5'>
      <div className='flex flex-row justify-center gap-5'>
        <button 
          onClick={() => handleClick('post')} 
          className="border-2 border-black shadow-[4px_4px_0px_0px_black] transition-transform duration-150 hover:scale-105 hover:bg-yellow-700 text-white bg-yellow-600 font-bold rounded-lg text-2xl w-48 px-4 py-4 text-center">
          Post Issues
        </button>
        <button 
          onClick={() => handleClick('claim')} 
          className="border-2 border-black shadow-[4px_4px_0px_0px_black] transition-transform duration-150 hover:scale-105 hover:bg-yellow-700 text-white bg-yellow-600 font-bold rounded-lg text-2xl w-48 px-4 py-4 text-center">
          Claim Issues
        </button>
        <button 
          onClick={() => handleClick('badges')} 
          className="border-2 border-black shadow-[4px_4px_0px_0px_black] transition-transform duration-150 hover:scale-105 hover:bg-yellow-700 text-white bg-yellow-600 font-bold rounded-lg text-2xl w-48 px-4 py-4 text-center">
          Win Badges
        </button>
        <button 
          onClick={() => handleClick('growth')} 
          className="border-2 border-black shadow-[4px_4px_0px_0px_black] transition-transform duration-150 hover:scale-105 hover:bg-yellow-700 text-white bg-yellow-600 font-bold rounded-lg text-2xl w-48 px-4 py-4 text-center">
          Track Growth
        </button>
      </div>
      <div className='flex justify-center transition-opacity duration-700 opacity-100'>
        {renderImage()}
      </div>
    </div>
    </>
  )
}
