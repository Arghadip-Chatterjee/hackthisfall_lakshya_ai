import React from 'react'

const ClearButton: React.FC = () => {
  const handleClear = async () => {
    const response = await fetch('/api/clear-database', { method: 'POST' })
    const data = await response.json()
    alert(data.message || data.error)
  }

  return (
    <button
      onClick={handleClear}
      className="bg-red-500 text-white p-2 rounded"
    >
      Clear Database
    </button>
  )
}

export default ClearButton
