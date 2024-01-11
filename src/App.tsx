import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { AuthContextProvider } from './context/AuthContext.tsx'
import './index.css'
import ErrorPage from './pages/ErrorPage.tsx'
import GameRoom from './pages/GameRoom.tsx'
import GameCreation from './pages/GameCreation/index.ts'
import GameScreen, { loader as gameLoader } from './pages/GameRoom/index.ts'
import Home from './pages/Home/index.tsx'
import Lobby from './pages/Lobby/index.tsx'
// import ProtectedRoute from './pages/ProtectedRoute.tsx'
import { loader as redirectLoader } from './pages/Redirect.tsx'
import Results, { loader as resultLoader } from './pages/Results/index.tsx'
import RootLayout from './pages/RootLayout.tsx'
import Scoring, { loader as scoringLoader } from './pages/Scoring/index.tsx'
import { queryClient } from './utils/fetchData.ts'

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
          <GameCreation />
          // </ProtectedRoute>
        ),
      },

      {
        path: 'game-room/:roomId',
        element: (
          // <ProtectedRoute>
          <GameRoom />
          // </ProtectedRoute>
        ),
        children: [
          {
            path: 'lobby',
            element: (
              // <ProtectedRoute>
              <Lobby />
              // </ProtectedRoute>
            ),
          },
          {
            path: 'game',
            element: <GameScreen />,
            loader: gameLoader,
          },
          {
            path: 'scoring',
            element: <Scoring />,
            loader: scoringLoader,
          },
          {
            path: 'result',
            element: <Results />,
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
