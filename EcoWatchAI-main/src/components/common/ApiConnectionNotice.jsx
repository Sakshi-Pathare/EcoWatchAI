import React, { useCallback, useEffect, useState } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';
import { request } from '../../services/apiClient.js';

export function ApiConnectionNotice() {
  const [connectionState, setConnectionState] = useState('checking');
  const [isRetrying, setIsRetrying] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const checkConnection = useCallback(async (manual = false) => {
    if (manual) setIsRetrying(true);
    try {
      await request('/health');
      setConnectionState('connected');
      setErrorMessage('');
    } catch (error) {
      setConnectionState('disconnected');
      setErrorMessage(error.message || 'The API could not be reached.');
    } finally {
      if (manual) setIsRetrying(false);
    }
  }, []);

  useEffect(() => {
    checkConnection();
    const intervalId = window.setInterval(() => checkConnection(), 15000);
    return () => window.clearInterval(intervalId);
  }, [checkConnection]);

  if (connectionState !== 'disconnected') return null;

  return (
    <div
      role="alert"
      aria-live="polite"
      className="bg-rose-50 border-b border-rose-200 text-rose-950"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-2.5 text-xs">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-rose-700" />
          <div>
            <p className="font-bold">Backend connection unavailable</p>
            <p className="mt-0.5">{errorMessage} Start the FastAPI server on port 8001, then retry.</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          icon={RefreshCw}
          loading={isRetrying}
          onClick={() => checkConnection(true)}
          className="shrink-0 border-rose-300 text-rose-900 hover:bg-rose-100"
        >
          Retry connection
        </Button>
      </div>
    </div>
  );
}
