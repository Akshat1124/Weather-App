import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import WeatherApp from './components/WeatherApp'
import { ThemeProvider } from './contexts/ThemeContext'

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error: error.message }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Weather App Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-orange-50 dark:bg-gray-900 p-8">
          <div className="max-w-2xl mx-auto bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-3xl p-6 border border-white/20 dark:border-gray-700/20 shadow-xl">
            <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Something went wrong!</h1>
            <p className="text-red-700 dark:text-red-300 mb-4">Error: {this.state.error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-500 dark:bg-red-600 text-white rounded-lg hover:bg-red-600 dark:hover:bg-red-700"
            >
              Reload App
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})

function App() {
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <div className="min-h-screen">
            <WeatherApp />
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  color: '#1e293b',
                },
                className: '',
                success: {
                  style: {
                    background: 'rgba(255, 255, 255, 0.9)',
                    color: '#059669',
                  },
                },
                error: {
                  style: {
                    background: 'rgba(255, 255, 255, 0.9)',
                    color: '#dc2626',
                  },
                },
              }}
            />
          </div>
        </QueryClientProvider>
      </ErrorBoundary>
    </ThemeProvider>
  )
}

export default App
