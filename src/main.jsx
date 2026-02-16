import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider } from "react-router-dom";
import { router } from './router/router';
import AuthProvider from './providers/AuthProvider';

// 1. Import QueryClient and Provider
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// 2. Create the client
const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 3. Wrap everything with QueryClientProvider */}
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div>
          <RouterProvider router={router} />
        </div>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)