import { Route, Routes, Navigate, HashRouter } from 'react-router'
import Connections from './pages/connections/connections'
import { SidebarProvider } from './components/ui/sidebar'
import Database from './pages/database/database'
import { store } from './store/store'
import { Provider } from 'react-redux'
import TablesView from './pages/database/tables-view/tables-view'
import TableExplorer from './components/database/table-explorer/table-explorer'
import SqlQueriesView from './pages/database/sql-queries-view/sql-queries-view'
import { Toaster } from 'sonner'
import { UpdaterView } from './components/updater'
import ChatView from './pages/chat/chat'

function App(): JSX.Element {
  return (
    <main className="max-h-screen flex flex-col overflow-hidden">
      <Provider store={store}>
        <SidebarProvider>
          <HashRouter>
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <Connections />
                    <UpdaterView />
                  </>
                }
              />
              <Route path="/updater" element={<UpdaterView />} />
              <Route path="/connection/:connectionId" element={<Database />}>
                <Route index element={<Navigate to="tables" replace />} />
                <Route path="tables" element={<TablesView />}>
                  <Route path=":tableName" element={<TableExplorer />} />
                </Route>
                <Route path="sql-queries" element={<SqlQueriesView />}>
                  <Route path=":queryId" element={<SqlQueriesView />} />
                </Route>
                <Route path="chat" element={<ChatView />} />
              </Route>
            </Routes>
          </HashRouter>
        </SidebarProvider>
      </Provider>
      <Toaster visibleToasts={1} richColors position="bottom-right" />
    </main>
  )
}

export default App
