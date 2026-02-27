import { RouterProvider } from 'react-router';
import { AppProvider } from '../context/AppContext';
import { router } from './routes';
import { Toaster } from 'sonner';
import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <RouterProvider router={router} />
        <Toaster position="top-center" richColors closeButton />
      </AppProvider>
    </ErrorBoundary>
  );
}
