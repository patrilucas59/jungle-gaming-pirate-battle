import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { QueryClient } from '@tanstack/query-core';
import { startMockApi } from './mocks/browser.ts';
import { QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

async function bootstrap(): Promise<void> {
  await startMockApi().catch(() => undefined);
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </StrictMode>,
  );
}

void bootstrap();