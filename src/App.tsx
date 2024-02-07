import { QueryClientProvider } from '@tanstack/react-query'
import { Suspense, lazy } from 'react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { AuthContextProvider } from './context/AuthContext.tsx'
import './index.css'
import ErrorPage from './pages/ErrorPage.tsx'
import CreationSkeleton from './pages/GameCreation/components/CreationSkeleton.tsx'
import GameRoom from './pages/GameRoom.tsx'
import GameSkeleton from './pages/GameScreen/components/GameSkeleton.tsx'
import Home from './pages/Home'
import LobbySkeleton from './pages/Lobby/components/LobbySkeleton.tsx'
import ProtectedGameRoute from './pages/ProtectedGameRoute.tsx'
import ProtectedRoute from './pages/ProtectedRoute.tsx'
import { loader as redirectLoader } from './pages/Redirect.tsx'
import ResultSkeleton from './pages/Results/components/ResultSkeleton.tsx'
import RootLayout from './pages/RootLayout.tsx'
import { queryClient } from './utils/fetchData.ts'
import Credits from './components/Credits.tsx'

const GameCreation = lazy(() => import('./pages/GameCreation'))
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
        path: 'credits',
        element: <Credits />,
      },

      {
        path: 'game-creation',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<CreationSkeleton />}>
              <GameCreation />
            </Suspense>
          </ProtectedRoute>
        ),
      },

      {
        path: 'game-room/:roomId',
        element: (
          <ProtectedGameRoute>
            <GameRoom />
          </ProtectedGameRoute>
        ),
        children: [
          {
            path: 'lobby',
            element: (
              <ProtectedGameRoute>
                <Suspense fallback={<LobbySkeleton />}>
                  <Lobby />
                </Suspense>
              </ProtectedGameRoute>
            ),
          },
          {
            path: 'game',
            element: (
              <ProtectedGameRoute>
                <Suspense fallback={<GameSkeleton />}>
                  <GameScreen />
                </Suspense>
              </ProtectedGameRoute>
            ),
          },
          {
            path: 'scoring',
            element: (
              <ProtectedGameRoute>
                <Suspense fallback={<GameSkeleton />}>
                  <Scoring />
                </Suspense>
              </ProtectedGameRoute>
            ),
          },
          {
            path: 'result',
            element: (
              <ProtectedGameRoute>
                <Suspense fallback={<ResultSkeleton />}>
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
