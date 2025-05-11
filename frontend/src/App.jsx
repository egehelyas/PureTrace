import React from 'react'
import './App.css'
import BatchForm from './components/BatchForm'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <h1 className="text-4xl font-bold text-center mb-8 text-green-800">
          Product Traceability System
        </h1>
        <BatchForm />
      </div>
    </div>
  )
}

export default App
