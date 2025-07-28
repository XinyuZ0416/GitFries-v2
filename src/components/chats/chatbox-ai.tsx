import { QAType } from '@/types/chat-bubble-props';
import React, { Ref, useEffect } from 'react'
import { motion } from 'framer-motion';

interface ChatBoxAIProps {
  closeAiChat: () => void, 
  aiChatBubbleList: React.ReactElement[], 
  aiChatEndRef: Ref<HTMLDivElement>, 
  handleSendAiMessage: (e: React.FormEvent<HTMLFormElement>) => Promise<void>,
  handleAiChatChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  question: string,
  renderAiChatBubbles: () => void, 
  questionAndAnswerList: QAType[],
}

export default function ChatBoxAI({
  closeAiChat, 
  aiChatBubbleList, 
  aiChatEndRef, 
  handleSendAiMessage, 
  handleAiChatChange,
  question,
  renderAiChatBubbles,
  questionAndAnswerList
}: ChatBoxAIProps) {
  
  useEffect(() => {
    renderAiChatBubbles();
  }, [questionAndAnswerList]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 50 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="border-4 border-black shadow-[4px_4px_0px_0px_black] fixed bottom-3 left-3 w-[320px] h-[480px] bg-white rounded-xl z-50 flex overflow-hidden"
    >
      <div className="w-full flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b-2 border-black">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Chat with Little Fries the bot</span>
          </div>
          <button onClick={closeAiChat} className="text-gray-500 hover:text-red-700 text-lg font-bold">
            <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex flex-col gap-4 p-4 overflow-y-auto flex-grow">
          {aiChatBubbleList}
          <div ref={aiChatEndRef}></div>
        </div>

          {/* Input */}
        <form onSubmit={handleSendAiMessage} className="p-3 border-t-2 border-black bg-gray-50">
          <div className="flex items-center px-3 py-2 bg-white border-2 border-black rounded-lg">
            <textarea
              rows={1}
              className="w-full p-2 text-sm text-gray-700 border-2 border-black rounded-lg resize-none focus:outline-none"
              placeholder="Type here..."
              onChange={handleAiChatChange}
              value={question}
            />
            <button type="submit" className="p-2 text-blue-600 hover:bg-blue-100 rounded-full">
              <svg className="w-5 h-5 rotate-90" fill="currentColor" viewBox="0 0 18 20">
                <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
