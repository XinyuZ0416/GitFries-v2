'use client'
import React, { useEffect, useRef, useState } from 'react'
import ChatBoxAI from './chatbox-ai';
import AiChatBubbleReceiver from './chat-bubble-receiver-ai';
import AiChatBubbleSender from './chat-bubble-sender-ai';
import { QAType } from '@/types/chat-bubble-props';

export default function ChatBoxAiWrapper() {
  const [ isAiChatOpen, setIsAiChatOpen ] = useState<boolean>(false);
  const aiChatEndRef = useRef<HTMLDivElement>(null);
  const [ question, setQuestion ] = useState<string>('');
  const [ questionAndAnswerList, setQuestionAndAnswerList ] = useState<QAType[]>([
    {
      content: "Hi hi hi hi! Anything I can help you with?",
      type: "answer",
    }
  ]);
  const [ aiChatBubbleList, setAiChatBubbleList ] = useState<React.ReactElement[]>([]);

  const openAiChat = () => {
    setIsAiChatOpen(true);
  }

  const closeAiChat = () => {
    setIsAiChatOpen(false);
  }

  const scrollToBottom = () => {
    aiChatEndRef.current?.scrollIntoView({ behavior: 'auto' });
  }

  const handleAiChatChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuestion(e.target.value);
  }

  const handleSendAiMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setQuestionAndAnswerList((prev = []) => [
      ...prev,
      {
        content: question,
        type: "question",
      }
    ])

    try {
      const res = await fetch(`/api/ai?q=${encodeURIComponent(question)}`);
      const data = await res.json();
      setQuestionAndAnswerList((prev = []) => [
        ...prev,
        {
          content: data.answer,
          type: "answer",
        }
      ])
    } catch (err) {
      console.error(err);
    }

    setQuestion('');
  }

  const renderAiChatBubbles = () => {
    if (questionAndAnswerList) {
      const bubbles = questionAndAnswerList.map((chat, index) => {
        const randomKey = `${Math.random().toString(36).substr(2, 9)}-${index}`;

        return chat.type === "answer" ? (
          <AiChatBubbleReceiver
            key={`${randomKey}-answer`}
            content={chat.content}
          />
        ) : (
          <AiChatBubbleSender
            key={`${randomKey}-question`}
            content={chat.content}
          />
        );
      });
      setAiChatBubbleList(bubbles);
    }
  }

  useEffect(() => {
    scrollToBottom();
  }, [aiChatBubbleList, question]);

  return (
    <>
    <button onClick={() => openAiChat()}>
      <img className="transition-transform duration-150 hover:scale-125 fixed left-3 bottom-3 size-20 z-9" src="/chatbot.png" />
    </button>
    { isAiChatOpen &&
      <ChatBoxAI
        closeAiChat={closeAiChat}
        aiChatBubbleList={aiChatBubbleList}
        aiChatEndRef={aiChatEndRef}
        handleSendAiMessage={handleSendAiMessage}
        handleAiChatChange={handleAiChatChange}
        question={question}
        renderAiChatBubbles={renderAiChatBubbles}
        questionAndAnswerList={questionAndAnswerList}
      />
    }
    </>
  )
}
