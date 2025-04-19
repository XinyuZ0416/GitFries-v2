import React from 'react'
import { useChatProvider } from '@/providers/chat-provider'

export default function ChatWindow() {
  const { closeChat } = useChatProvider();

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Message sent');
  }

  const handleCloseChat = () => {
    closeChat();
  }

  const handleDeleteChat = () => {
    confirm(`Delete chat? This action can't be undone.`);
  }

  const mockUsers = [
    { id: 1, name: "Bonnie Green", avatar: "/potato.png" },
    { id: 2, name: "Alex Johnson", avatar: "/potato.png" },
    { id: 3, name: "Taylor", avatar: "/potato.png" },
  ];

  return (
    <div className="fixed bottom-3 right-3 w-[640px] h-[480px] bg-white border shadow-2xl rounded-xl z-50 flex overflow-hidden">
      {/* Left Sidebar */}
      <div className="w-1/3 border-r bg-gray-50 overflow-y-auto">
        <div className="p-3 font-semibold border-b">Chats</div>
        <ul>
          {mockUsers.map((user) => (
            <li key={user.id} className="flex border-b items-center gap-2 p-3 cursor-pointer hover:bg-gray-100">
              <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
              <div className="flex flex-col">
                <span className="font-medium text-sm text-gray-700">{user.name}</span>
              </div>
              <button onClick={handleDeleteChat} className="text-gray-500 ml-auto hover:text-red-700 text-lg font-bold">
                <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Right Chat Content */}
      <div className="w-2/3 flex flex-col">
        {/* Chat Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Bonnie Green</span>
          </div>
          <button onClick={handleCloseChat} className="text-gray-500 hover:text-red-700 text-lg font-bold">
            <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="flex items-start gap-2.5 mb-4">
            <img className="w-8 h-8 rounded-full" src="/potato.png" alt="Jese" />
            <div className="flex flex-col w-full max-w-[320px] leading-1.5 p-4 bg-gray-100 rounded-e-xl rounded-es-xl">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-semibold">Bonnie Green</span>
                <span className="text-sm text-gray-500">11:46</span>
              </div>
              <p className="text-sm text-gray-700 mt-2">That's awesome. I think our users will really appreciate the improvements.</p>
            </div>
          </div>
        </div>

        {/* Input */}
        <form onSubmit={handleSendMessage} className="p-3 border-t bg-gray-50">
          <div className="flex items-center px-3 py-2 bg-white border rounded-lg">
            <textarea
              rows={1}
              className="w-full p-2 text-sm text-gray-900 rounded-lg resize-none focus:outline-none"
              placeholder="Your message..."
            />
            <button type="submit" className="p-2 text-blue-600 hover:bg-blue-100 rounded-full">
              <svg className="w-5 h-5 rotate-90" fill="currentColor" viewBox="0 0 18 20">
                <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z"/>
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
