import React from 'react'

const TestApp = () => {
  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <h1 style={{ color: 'red' }}>React Test - If you see this, React is working!</h1>
      <p>Date: {new Date().toLocaleString()}</p>
    </div>
  )
}

export default TestApp
