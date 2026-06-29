import React from 'react';
import { RefreshCw, Home, Copy, AlertTriangle } from 'lucide-react';
import { toast } from 'react-toastify';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null, errorId: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    const errorId = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.setState({ errorInfo, errorId });
    // In a production app, this is where you'd log the error to Sentry, LogRocket, etc.
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleCopyError = () => {
    const errorDetails = `Error ID: ${this.state.errorId}\nError: ${this.state.error?.toString()}\nStack: ${this.state.errorInfo?.componentStack}`;
    navigator.clipboard.writeText(errorDetails);
    toast.success('Error details copied to clipboard');
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4 transition-colors">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg max-w-md w-full text-center border border-gray-100 dark:border-gray-700">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Something went wrong</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">We've encountered an unexpected error. Our technical team has been notified.</p>
            
            <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-3 rounded-lg mb-6 flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400 font-mono">Error ID: {this.state.errorId || 'N/A'}</span>
              <button 
                onClick={this.handleCopyError}
                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center gap-1 font-medium transition-colors"
              >
                <Copy className="w-4 h-4" /> Copy Details
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <RefreshCw className="w-5 h-5" /> Reload
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="flex-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Home className="w-5 h-5" /> Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
