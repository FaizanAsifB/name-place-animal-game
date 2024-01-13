import { AuthContext } from '@/context/AuthContext'
import { GameScreenRoundsData } from '@/lib/types'
import { sortScore } from '@/utils/helpers'
import { ReactNode, useContext } from 'react'
import { P } from '../typography/TextContent'
import UserInfo from './UserInfo'

type GameHeaderProps = {
  children?: ReactNode
  roundsData: GameScreenRoundsData
}

//TODO CHANGE TITLE prop name

const GameHeader = ({ children, roundsData }: GameHeaderProps) => {
  const currentUser = useContext(AuthContext)

  const scoresData = sortScore(roundsData.scores)

  return (
    <header className="grid items-center grid-cols-4 pt-6 mb-2 justify-items-center">
      {currentUser && (
        <div className="flex flex-col items-center">
          <UserInfo
            userId={currentUser.uid}
            className="flex-col gap-1 text-xs"
            avatarSize="h-9 w-9"
          />
          <span className="font-semibold text">
            {roundsData.scores[currentUser.uid].totalScore}
          </span>
        </div>
      )}
      <ul className="self-start col-span-2 col-start-2 p-2 space-y-1 place-self-start">
        {scoresData.map((score, i) => {
          if (i > 1) return
          return (
            <>
              <li key={score[0]} className="flex items-center gap-1 ">
                {
                  <UserInfo
                    userId={score[0]}
                    className="text-xs"
                    avatarSize="h-6 w-6"
                  />
                }
                <span className="text-xs font-semibold">
                  {score[1].totalScore}
                </span>
              </li>
              <li key={score[0]} className="flex items-center gap-1 ">
                {
                  <UserInfo
                    userId={score[0]}
                    className="text-xs"
                    avatarSize="h-6 w-6"
                  />
                }
                <span className="text-xs font-semibold">
                  {score[1].totalScore}
                </span>
              </li>
            </>
          )
        })}
      </ul>

      {children}
    </header>
  )
}
export default GameHeader
