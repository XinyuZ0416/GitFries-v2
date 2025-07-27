import React, { useState } from 'react'

export default function FeatureIntro() {
  const [ selectedFeature, setSelectedFeature ] = useState<string>('');

  const handleClick = (feature: string) => {
    setSelectedFeature(feature);
  }
  
  const renderImage = () => {
    switch(selectedFeature) {
      case 'post':
        return <img src="/feature-intro/post-issue.png" alt='post issue demo' />;
      case 'claim':
        return <img src="/feature-intro/claim-issue.png" alt='claim issue demo' />;
      case 'badges':
        return <img src="/feature-intro/win-badges.png" alt='win badges demo' />;
      case 'growth':
        return <img src="/feature-intro/track-growth.png" alt='track growth demo' />;
      default:
        return null;
    }
  }

  return (
    <>
    <div className='flex flex-col gap-5'>
      <div className='flex flex-row justify-center gap-5'>
        <button onClick={() => handleClick('post')} className="text-white bg-yellow-800 hover:bg-yellow-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">
          Post Issues
        </button>
        <button onClick={() => handleClick('claim')} className="text-white bg-yellow-800 hover:bg-yellow-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">
          Claim Issues
        </button>
        <button onClick={() => handleClick('badges')} className="text-white bg-yellow-800 hover:bg-yellow-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">
          Win Badges
        </button>
        <button onClick={() => handleClick('growth')} className="text-white bg-yellow-800 hover:bg-yellow-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">
          Track Growth
        </button>
      </div>
      <div className='flex justify-center'>
        {renderImage()}
      </div>
    </div>
    </>
  )
}
