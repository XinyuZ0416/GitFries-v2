import { AiChatBubbleProps } from '@/types/chat-bubble-props'
import React from 'react'

export default function AiChatBubbleReceiver({content}: AiChatBubbleProps) {
  return (
    <div className="flex mr-auto items-start gap-2.5">
      <img className="w-8 h-8 rounded-full" src='/potato.png' alt='Little Fries' />
      <div className="flex flex-col w-full max-w-[320px] leading-1.5 p-4 bg-gray-100 rounded-e-xl rounded-es-xl">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-semibold">Little Fries</span>
        </div>
        <p className="text-sm text-gray-700 mt-2">{content}</p>
      </div>
    </div>
  )
}
