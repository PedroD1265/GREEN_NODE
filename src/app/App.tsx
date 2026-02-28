import { RouterProvider } from 'react-router';
import { AppProvider, useApp } from '../context/AppContext';
import { router } from './routes';
import { Toaster } from 'sonner';
import { ErrorBoundary } from './components/ErrorBoundary';
import { BackendStatus } from './components/BackendStatus';

function AppInner() {
  const { backendStatus, appMode, retryCount, maxRetries, retryBackend } = useApp();
  return (
    <>
      <BackendStatus status={backendStatus} appMode={appMode} retryCount={retryCount} maxRetries={maxRetries} onRetry={retryBackend} />
      <RouterProvider router={router} />
      <Toaster position="top-center" richColors closeButton />
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AppInner />
      </AppProvider>
    </ErrorBoundary>
  );
}
