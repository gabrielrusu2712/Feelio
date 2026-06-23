import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  error: Error | null
}

// Must be a class (React error boundaries require lifecycle methods). The
// fallback deliberately uses inline styles and no theme/styled-components, since
// the thing that crashed might be the theme/provider tree itself.
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Feelio crashed:', error, info.componentStack)
  }

  render() {
    const { error } = this.state
    const { children } = this.props

    if (error) {
      return (
        <div
          role="alert"
          style={{
            minHeight: '100dvh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            padding: '2rem',
            fontFamily: 'system-ui, sans-serif',
            textAlign: 'center',
          }}
        >
          <h1 style={{ margin: 0, fontSize: '1.25rem' }}>Something went wrong</h1>
          <pre
            style={{
              maxWidth: '42rem',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              color: '#9b0f06',
              margin: 0,
            }}
          >
            {error.message}
          </pre>
          <button type="button" onClick={() => window.location.reload()}>
            Reload
          </button>
        </div>
      )
    }

    return children
  }
}

export default ErrorBoundary
