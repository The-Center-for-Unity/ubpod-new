import React from 'react';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to an error reporting service
    console.error('Section Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return this.props.fallback || (
        <div className="p-4 rounded-lg bg-red-50 text-red-800">
          <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
          <p className="text-sm opacity-80">
            We apologize for the inconvenience. Please try refreshing the page.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
} 