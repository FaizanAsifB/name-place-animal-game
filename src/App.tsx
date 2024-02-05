import { QueryClientProvider } from '@tanstack/react-query'
import { Suspense, lazy } from 'react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import LoadingSpinner from './components/ui/LoadingSpinner.tsx'
import { AuthContextProvider } from './context/AuthContext.tsx'
import './index.css'
import ErrorPage from './pages/ErrorPage.tsx'
import Home from './pages/Home'
import ProtectedGameRoute from './pages/ProtectedGameRoute.tsx'
import ProtectedRoute from './pages/ProtectedRoute.tsx'
import { loader as redirectLoader } from './pages/Redirect.tsx'
import RootLayout from './pages/RootLayout.tsx'
import { queryClient } from './utils/fetchData.ts'

const GameCreation = lazy(() => import('./pages/GameCreation'))
const GameRoom = lazy(() => import('./pages/GameRoom.tsx'))
const Lobby = lazy(() => import('./pages/Lobby'))
const Results = lazy(() => import('./pages/Results'))
const Scoring = lazy(() => import('./pages/Scoring'))
const GameScreen = lazy(() => import('./pages/GameScreen'))

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },

      {
        path: 'game-creation',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <GameCreation />
            </Suspense>
          </ProtectedRoute>
        ),
      },

      {
        path: 'game-room/:roomId',
        element: (
          <ProtectedGameRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <GameRoom />
            </Suspense>
          </ProtectedGameRoute>
        ),
        children: [
          {
            path: 'lobby',
            element: (
              <ProtectedGameRoute>
                <Suspense fallback={<LoadingSpinner />}>
                  <Lobby />
                </Suspense>
              </ProtectedGameRoute>
            ),
          },
          {
            path: 'game',
            element: (
              <ProtectedGameRoute>
                <Suspense fallback={<LoadingSpinner />}>
                  <GameScreen />
                </Suspense>
              </ProtectedGameRoute>
            ),
          },
          {
            path: 'scoring',
            element: (
              <ProtectedGameRoute>
                <Suspense fallback={<LoadingSpinner />}>
                  <Scoring />
                </Suspense>
              </ProtectedGameRoute>
            ),
          },
          {
            path: 'result',
            element: (
              <ProtectedGameRoute>
                <Suspense fallback={<LoadingSpinner />}>
                  <Results />
                </Suspense>
              </ProtectedGameRoute>
            ),
          },
        ],
      },
      {
        path: '/*',
        loader: redirectLoader,
      },
    ],
  },
])

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <RouterProvider router={router} />
      </AuthContextProvider>
    </QueryClientProvider>
  )
}

export default App
