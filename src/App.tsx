import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { AuthContextProvider } from './context/AuthContext.tsx'
import './index.css'
import ErrorPage from './pages/ErrorPage.tsx'
import { loader as gameLoader } from './pages/GameRoom/index.ts'
import Home from './pages/Home/index.tsx'
// import ProtectedRoute from './pages/ProtectedRoute.tsx'
import { Suspense, lazy } from 'react'
import LoadingSpinner from './components/ui/LoadingSpinner.tsx'
import { loader as redirectLoader } from './pages/Redirect.tsx'
import { loader as resultLoader } from './pages/Results/index.tsx'
import RootLayout from './pages/RootLayout.tsx'
import { loader as scoringLoader } from './pages/Scoring/index.tsx'
import { queryClient } from './utils/fetchData.ts'

const GameCreation = lazy(() => import('./pages/GameCreation/index.ts'))
const GameRoom = lazy(() => import('./pages/GameRoom.tsx'))
const Lobby = lazy(() => import('./pages/Lobby/index.tsx'))
const Results = lazy(() => import('./pages/Results/index.tsx'))
const Scoring = lazy(() => import('./pages/Scoring/index.tsx'))
const GameScreen = lazy(() => import('./pages/GameRoom/index.ts'))

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
          // <ProtectedRoute>
          <Suspense fallback={<LoadingSpinner />}>
            <GameCreation />
          </Suspense>
          // </ProtectedRoute>
        ),
      },

      {
        path: 'game-room/:roomId',
        element: (
          // <ProtectedRoute>
          <Suspense fallback={<LoadingSpinner />}>
            <GameRoom />
          </Suspense>
          // </ProtectedRoute>
        ),
        children: [
          {
            path: 'lobby',
            element: (
              // <ProtectedRoute>
              <Suspense fallback={<LoadingSpinner />}>
                <Lobby />
              </Suspense>
              // </ProtectedRoute>
            ),
          },
          {
            path: 'game',
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <GameScreen />,
              </Suspense>
            ),
            loader: gameLoader,
          },
          {
            path: 'scoring',
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <Scoring />
              </Suspense>
            ),
            loader: scoringLoader,
          },
          {
            path: 'result',
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <Results />
              </Suspense>
            ),
            loader: resultLoader,
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
