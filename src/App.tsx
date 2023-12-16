import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { AuthContextProvider } from './context/AuthContext.tsx'
import './index.css'
import RootLayout from './layout/RootLayout.tsx'
import Error from './pages/Error.tsx'
import GameCreation from './pages/GameCreation/index.tsx'
import GameRoom, { loader as gameLoader } from './pages/GameRoom/index.tsx'
import Home from './pages/Home/index.tsx'
import Lobby from './pages/Lobby/index.tsx'
import Scoring, { loader as scoringLoader } from './pages/Scoring/index.tsx'
import { queryClient } from './utils/fetchData.ts'
import Results from './pages/Results/index.tsx'
import Game from './layout/Game.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    // errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'game-creation',
        element: <GameCreation />,
      },
      {
        path: 'lobby/:roomId',
        element: <Lobby />,
      },
      {
        path: 'game/:roomId',
        element: <Game />,
        children: [
          {
            index: true,
            element: <GameRoom />,
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
          },
        ],
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
