'use client'

import React from 'react'
import { AlertCircle, RefreshCw, Home } from 'lucide-react'

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  resetError = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback
      return <FallbackComponent error={this.state.error} resetError={this.resetError} />
    }

    return this.props.children
  }
}

const DefaultErrorFallback: React.FC<{ error: Error; resetError: () => void }> = ({ 
  error, 
  resetError 
}) => {
  const isDevelopment = process.env.NODE_ENV === 'development'

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center p-6">
      <div className="max-w-lg w-full">
        <div className="card text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Something went wrong
          </h1>
          
          <p className="text-gray-600 mb-6">
            We encountered an unexpected error while processing your request. 
            This might be due to an invalid file format or corrupted data.
          </p>

          {isDevelopment && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg text-left">
              <h3 className="font-semibold text-gray-900 mb-2">Error Details:</h3>
              <pre className="text-sm text-gray-700 whitespace-pre-wrap break-all">
                {error.message}
              </pre>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={resetError}
              className="btn-secondary flex items-center justify-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Try Again</span>
            </button>
            
            <button
              onClick={() => {
                sessionStorage.clear()
                window.location.href = '/'
              }}
              className="btn-primary flex items-center justify-center space-x-2"
            >
              <Home className="w-4 h-4" />
              <span>Go Home</span>
            </button>
          </div>

          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-left">
            <h4 className="font-semibold text-blue-900 mb-2">Troubleshooting Tips:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Make sure you uploaded the correct Instagram data export ZIP file</li>
              <li>• Ensure the ZIP file contains the &apos;connections&apos; folder</li>
              <li>• Try downloading a fresh export from Instagram</li>
              <li>• Check that the export format is JSON (not HTML)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ErrorBoundary