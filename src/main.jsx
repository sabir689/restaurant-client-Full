import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider } from "react-router-dom";
import { router } from './router/router';
import AuthProvider from './providers/AuthProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { HelmetProvider } from 'react-helmet-async'; // 1. Import HelmetProvider

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
     
      <HelmetProvider> 
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </HelmetProvider>
      
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>,
)