import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';

export default function Offline() {
  const router = useRouter();
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Check initial online status
    setIsOnline(navigator.onLine);

    // Listen for online/offline events
    const handleOnline = () => {
      setIsOnline(true);
      // Redirect to dashboard when back online
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [router]);

  const handleRetry = () => {
    if (navigator.onLine) {
      router.push('/dashboard');
    } else {
      alert('Still offline. Please check your internet connection.');
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card>
          <div className="text-center py-12 px-6">
            {/* Offline Icon */}
            <div className="mx-auto w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-6">
              <svg
                className="w-12 h-12 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
                />
              </svg>
            </div>

            {/* Status Message */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {isOnline ? 'Back Online! 🎉' : 'You\'re Offline'}
            </h1>
            
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {isOnline 
                ? 'Great! Your connection has been restored. Redirecting you back...'
                : 'It looks like you\'ve lost your internet connection. Don\'t worry, some features are still available offline.'
              }
            </p>

            {/* Offline Features List */}
            {!isOnline && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left max-w-md mx-auto">
                <h3 className="font-semibold text-blue-900 mb-2">Available Offline:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>✓ View cached exam materials</li>
                  <li>✓ Review your progress and achievements</li>
                  <li>✓ Access saved study goals</li>
                  <li>✓ View previously loaded content</li>
                </ul>
              </div>
            )}

            {/* Retry Button */}
            <div className="space-y-3">
              <Button onClick={handleRetry} className="w-full max-w-xs">
                {isOnline ? 'Go to Dashboard' : 'Retry Connection'}
              </Button>
              
              {!isOnline && (
                <Button 
                  variant="secondary" 
                  onClick={() => router.push('/dashboard')}
                  className="w-full max-w-xs"
                >
                  Continue Offline
                </Button>
              )}
            </div>

            {/* Connection Status */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                <span className="text-sm text-gray-600">
                  Status: {isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
