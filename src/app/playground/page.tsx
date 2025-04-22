'use client'
import React, { useState } from 'react'

export default function Playground() {
  const [ question, setQuestion ] = useState<string>('');
  const [ answer, setAnswer ] = useState<string>('');
  
  const handleChange = (e: any) => {
    setQuestion(e.target.value);
  }

  const handleSubmit = async(e: any) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/ai?q=${encodeURIComponent(question)}`);
      const data = await res.json();
      setAnswer(data.answer);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
    <form onSubmit={handleSubmit}>
      <input required type='text' onChange={handleChange}></input>
      <button>Send</button>
    </form>
    {answer}
    </>
  )
}
