import { ThemeProvider } from 'next-themes'
import {  Route, Routes, Navigate, HashRouter } from 'react-router'
import Connections from './pages/connections/connections'
import { SidebarProvider } from './components/ui/sidebar'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/query-client'
import Database from './pages/database/database'
import { store } from './store/store'
import { Provider } from 'react-redux'
import TablesView from './pages/database/tables-view/tables-view'
import TableExplorer from './components/database/table-explorer/table-explorer'
import SqlQueriesView from './pages/database/sql-queries-view/sql-queries-view'
import { Toaster } from 'sonner'

function App(): JSX.Element {
  return (
    <main className="max-h-screen flex flex-col overflow-hidden">
      <Provider store={store}>
        <HashRouter>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <QueryClientProvider client={queryClient}>
                <Routes>
                  <Route path="/" element={ <SidebarProvider><Connections /> </SidebarProvider>} />
             
                  <Route path="/connection/:connectionId" element={ <SidebarProvider><Database /> </SidebarProvider>}>
                    <Route index element={<Navigate to="tables" replace />} />
                    <Route path="tables" element={<TablesView />}>
                      <Route path=":tableName" element={<TableExplorer />} />
                    </Route>
                    <Route path="sql-queries" element={<SqlQueriesView />}>
                      <Route path=":queryId" element={null} />
                    </Route>
                  </Route>
                </Routes>
            </QueryClientProvider>
          </ThemeProvider>
        </HashRouter>
      </Provider>
      <Toaster visibleToasts={1} richColors position="bottom-right" />
    </main>
  )
}

export default App
