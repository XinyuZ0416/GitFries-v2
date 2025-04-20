import { ChatBubbleProps } from '@/types/chat-bubble-props'
import { formatTimeOrDate } from '@/utils/format-date'
import React from 'react'

export default function ChatBubbleSender({ url, username, time, content }: ChatBubbleProps) {
  return (
    <div className="flex ml-auto items-start gap-2.5">
      <div className="flex flex-col w-full max-w-[320px] leading-1.5 p-4 bg-gray-200 rounded-s-xl rounded-ee-xl">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-semibold">{username}</span>
          <span className="text-sm text-gray-500">{formatTimeOrDate(time.toDate())}</span>
        </div>
        <p className="text-sm text-gray-700 mt-2">{content}</p>
      </div>
      <img className="w-8 h-8 rounded-full" src={url} alt={username} />
    </div>
  )
}
