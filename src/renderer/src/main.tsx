import './assets/main.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/query-client'
import { ThemeProvider } from 'next-themes'
import {actionsProxy} from './lib/action-proxy'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <App />
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
)

if (location.pathname === '/') {
  actionsProxy.checkForUpdates.invoke()
}