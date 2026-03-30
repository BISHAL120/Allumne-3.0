import React from 'react'

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-16 h-16 border-4 border-gray-300 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export default Loading