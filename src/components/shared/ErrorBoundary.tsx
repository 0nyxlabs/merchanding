import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.props.onError?.(error, errorInfo)
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <AlertTriangle className="mb-4 h-12 w-12 text-destructive" />
          <h3 className="text-lg font-semibold">Something went wrong</h3>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            An unexpected error occurred. Please try again.
          </p>
          {import.meta.env.DEV && this.state.error && (
            <pre className="mt-4 max-w-lg overflow-auto rounded bg-muted p-3 text-left text-xs">
              {this.state.error.message}
            </pre>
          )}
          <button
            onClick={this.handleRetry}
            className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
