const API_BASE_URL = 'http://localhost:8000' // Adjust if needed

export const uploadResume = async (formData: FormData) => {
  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    body: formData,
  })
  return response.json()
}

export const submitAnswer = async (data: { userId: string, question: string, answer: string }) => {
  const response = await fetch(`${API_BASE_URL}/submit-answer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return response.json()
}

export const clearDatabase = async () => {
  const response = await fetch(`${API_BASE_URL}/clear-database`, { method: 'POST' })
  return response.json()
}
