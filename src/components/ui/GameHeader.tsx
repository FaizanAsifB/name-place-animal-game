import { AuthContext } from '@/context/AuthContext'
import { GameScreenRoundsData, RoundsData } from '@/lib/types'
import { sortScore } from '@/utils/helpers'
import { ReactNode, useContext } from 'react'
import UserInfo from './UserInfo'

type GameHeaderProps = {
  children?: ReactNode
  roundsData: RoundsData | GameScreenRoundsData | undefined
}

const GameHeader = ({ children, roundsData }: GameHeaderProps) => {
  const currentUser = useContext(AuthContext)

  const scoresData = sortScore(roundsData?.scores)

  return (
    <header className="flex items-center gap-3 px-4 pt-6 pb-2 rounded-t-lg md:gap-6 lg:gap-8 bg-primary-dark">
      {currentUser && (
        <div className="flex flex-col items-center">
          <UserInfo
            userId={currentUser.uid}
            className="flex-col gap-1 text-xs md:text-sm lg:text-base "
            avatarSize="h-9 w-9 md:h-12 md:w-12 lg:h-14 lg:w-14"
          />
          <span className="text-base font-semibold md:text-lg lg:text-xl">
            {roundsData?.scores[currentUser.uid].totalScore}
          </span>
        </div>
      )}
      {roundsData && roundsData.currentRound > 1 && (
        <ul className="self-start col-span-2 col-start-2 p-2 space-y-1 place-self-start">
          {scoresData?.map((score, i) => {
            if (i > 1) return
            return (
              <li key={score[0]} className="flex items-center gap-1 ">
                {
                  <UserInfo
                    userId={score[0]}
                    className="text-xs md:text-sm lg:text-base "
                    avatarSize="h-6 w-6 md:h-8 md:w-8 lg:h-10 lg:w-10"
                  />
                }
                <span className="text-xs font-semibold md:text-sm lg:text-base">
                  {score[1].totalScore}
                </span>
              </li>
            )
          })}
        </ul>
      )}

      {children}
    </header>
  )
}
export default GameHeader
