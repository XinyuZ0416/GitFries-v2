import { AiChatBubbleProps } from '@/types/chat-bubble-props'
import React from 'react'

export default function AiChatBubbleSender({content}: AiChatBubbleProps) {
  return (
    <div className="flex ml-auto items-start gap-2.5">
      <div className="border-2 border-black flex flex-col w-full max-w-[320px] leading-1.5 p-4 bg-yellow-300 rounded-s-xl rounded-ee-xl">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-semibold">Me</span>
        </div>
        <p className="text-sm text-gray-700 mt-2">{content}</p>
      </div>
    </div>
  )
}
