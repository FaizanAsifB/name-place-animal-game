import { H1 } from '@/components/typography/Headings'
import AlphabetsScroll from '@/components/ui/AlphabetsScroll'
import { Dialog } from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import useNextPhase from '@/hooks/useNextPhase'
import { RoundsData } from '@/lib/types'
import { sortScore } from '@/utils/helpers'
import { useMemo } from 'react'
import UserInfo from '../../../components/ui/UserInfo'
import GameEndModal from './GameEndModal'

type ResultsTableProps = {
  roundsData: RoundsData
  isLastRound: boolean
}

const ResultsTable = ({ roundsData, isLastRound }: ResultsTableProps) => {
  const { data: gameState } = useNextPhase()

  const scoresData = useMemo(
    () => sortScore(roundsData?.scores),
    [roundsData?.scores]
  )

  return (
    <>
      {gameState?.gameState === 'INIT' && (
        <AlphabetsScroll gameState={gameState} />
      )}
      <Dialog defaultOpen={isLastRound}>
        <GameEndModal
          scoresData={scoresData}
          isLastRound={isLastRound}
          gameState={gameState}
        />
      </Dialog>
      <Table>
        <TableCaption className="caption-top">
          <H1>Results</H1>
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Position</TableHead>
            <TableHead>Player</TableHead>
            {roundsData?.roundsConfig.map((_, i) => (
              <TableHead className="hidden" key={i}>
                {i + 1}
              </TableHead>
            ))}
            <TableHead>Current Round</TableHead>
            <TableHead>Total Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {scoresData?.map((item, i) => (
            <TableRow key={item[0]}>
              <TableCell>{i + 1}</TableCell>
              <TableCell className="flex gap-2">
                <UserInfo userId={item[0]} />
                {isLastRound && i === 0 && (
                  <img
                    src="/images/trophy.svg"
                    alt="Winner trophy"
                    className="w-10 h-10"
                  />
                )}
              </TableCell>
              {/* Current Round score
              // TODO Maybe remove the bang!? */}
              <TableCell>
                {item[1].scoreRounds[roundsData!.currentRound - 1]}
              </TableCell>
              {item[1].scoreRounds.map((score, i) => (
                <TableCell className="hidden" key={score + i}>
                  {score}
                </TableCell>
              ))}
              {roundsData?.roundsConfig.map((_, i) => {
                if (i + 1 <= roundsData.currentRound) return
                return (
                  <TableCell className="hidden" key={i}>
                    {'-'}
                  </TableCell>
                )
              })}
              <TableCell>{item[1].totalScore}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}
export default ResultsTable
