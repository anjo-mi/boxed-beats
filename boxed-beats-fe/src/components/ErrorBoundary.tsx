import { Component, type ReactNode, type ErrorInfo } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
          <h1 className="font-display text-4xl font-bold text-brand-text">Something went wrong</h1>
          <p className="mt-2 max-w-md text-brand-text-muted">An unexpected error occurred. Please refresh the page.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
          >
            Refresh page
          </button>
          {import.meta.env.DEV && this.state.error && (
            <pre className="mt-4 max-w-xl overflow-auto rounded-lg bg-secondary p-4 text-left text-xs text-brand-text-muted">
              {this.state.error.message}
            </pre>
          )}
        </div>
      )
    }

    return this.props.children
  }
}
