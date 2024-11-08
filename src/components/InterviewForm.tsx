"use client";
import React, { useState } from 'react'

const InterviewForm: React.FC = () => {
  const [userId, setUserId] = useState('')
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const response = await fetch('/api/submit-answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, question, answer }),
    })
    const data = await response.json()
    alert(data.message || data.error)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        placeholder="User ID"
        className="border p-2 rounded"
        required
      />
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Question"
        className="border p-2 rounded"
        required
      />
      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Answer"
        className="border p-2 rounded"
        rows={4}
        required
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Submit Answer
      </button>
    </form>
  )
}

export default InterviewForm
