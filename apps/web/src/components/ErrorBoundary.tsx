import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface Props { children: ReactNode }
interface State { hasError: boolean; message: string }

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, message: '' }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[BayParee] Uncaught error:', error, info)
  }

  render() {
    if (!this.state.hasError) return this.props.children
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#080808', padding: '2rem', textAlign: 'center',
      }}>
        <div style={{ maxWidth: 480 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 16, background: 'rgba(245,176,65,0.1)',
            border: '1px solid rgba(245,176,65,0.3)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', margin: '0 auto 24px', fontSize: 28,
          }}>⚡</div>
          <h1 style={{ color: '#F4F6FA', fontSize: 24, fontWeight: 700, marginBottom: 12 }}>
            Something went wrong
          </h1>
          <p style={{ color: '#A7ACB8', fontSize: 14, marginBottom: 32, lineHeight: 1.6 }}>
            An unexpected error occurred. The team has been notified.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => this.setState({ hasError: false, message: '' })}
              style={{
                padding: '10px 24px', borderRadius: 8, border: 'none', cursor: 'pointer',
                background: '#F5B041', color: '#000', fontWeight: 700, fontSize: 14,
              }}
            >Try Again</button>
            <Link to="/" style={{
              padding: '10px 24px', borderRadius: 8, textDecoration: 'none',
              border: '1px solid rgba(245,176,65,0.3)', color: '#F5B041',
              fontWeight: 600, fontSize: 14,
            }}>Go Home</Link>
          </div>
        </div>
      </div>
    )
  }
}
