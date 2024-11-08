"use client";
import React, { useState } from 'react'

const UploadForm: React.FC = () => {
  const [resume, setResume] = useState<File | null>(null)
  const [githubLinks, setGithubLinks] = useState('')
  const [role, setRole] = useState('')

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!resume) {
      alert('Please upload a resume.')
      return
    }

    const formData = new FormData()
    formData.append('resume', resume)
    formData.append('githubLinks', githubLinks)
    formData.append('role', role)

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    const data = await response.json()
    alert(data.message || data.error)
  }

  return (
    <form onSubmit={handleUpload} className="space-y-4">
      <input
        type="file"
        onChange={(e) => e.target.files && setResume(e.target.files[0])}
        className="border p-2 rounded"
        required
      />
      <input
        type="text"
        value={githubLinks}
        onChange={(e) => setGithubLinks(e.target.value)}
        placeholder="GitHub Links"
        className="border p-2 rounded"
        required
      />
      <input
        type="text"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        placeholder="Role"
        className="border p-2 rounded"
        required
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Upload
      </button>
    </form>
  )
}

export default UploadForm
