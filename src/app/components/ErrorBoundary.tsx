import React, { Component, ReactNode } from 'react';
import { setAppMode } from '../config/appMode';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          height: '100vh', padding: '2rem', textAlign: 'center', fontFamily: 'system-ui, sans-serif',
        }}>
          <div style={{
            width: 64, height: 64, backgroundColor: '#FEE2E2', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, fontSize: 28,
          }}>
            ⚠️
          </div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: '#0B3D2E', marginBottom: 8 }}>
            Algo salió mal
          </h1>
          <p style={{ fontSize: 14, color: '#4B5563', marginBottom: 16, maxWidth: 320 }}>
            {this.state.error?.message || 'Error desconocido'}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.href = '/';
              }}
              style={{
                padding: '10px 24px', backgroundColor: '#0F5132', color: 'white', border: 'none',
                borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: 'pointer',
              }}
            >
              Volver al inicio
            </button>
            <button
              onClick={() => {
                setAppMode('demo');
                this.setState({ hasError: false, error: null });
                window.location.href = '/';
              }}
              style={{
                padding: '8px 20px', backgroundColor: 'transparent', color: '#B45309', border: '1px solid #D97706',
                borderRadius: 12, fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}
            >
              Forzar modo DEMO
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
