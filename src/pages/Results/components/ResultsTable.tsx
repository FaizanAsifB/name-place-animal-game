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
import { RoundsData } from '@/lib/types'
import UserInfo from '../../../components/ui/UserInfo'
import GameEndModal from './GameEndModal'

type ResultsTableProps = {
  roundsData: RoundsData
  isLastRound: boolean
}

const ResultsTable = ({ roundsData, isLastRound }: ResultsTableProps) => {
  const scoresData = Object.entries(roundsData.scores).sort(
    (a, b) => b[1].totalScore - a[1].totalScore
  )

  return (
    <>
      <Dialog defaultOpen={isLastRound}>
        <GameEndModal scoresData={scoresData} isLastRound={isLastRound} />
      </Dialog>
      <Table className="w-full text-left">
        <TableCaption className="caption-top">
          <h1 className="text-4xl font-extrabold tracking-tight scroll-m-20 lg:text-5xl">
            Results
          </h1>
        </TableCaption>
        <TableHeader>
          {/* <TableRow>
          <TableHead></TableHead>
          <TableHead></TableHead>
          <TableHead
            className="text-center"
            colSpan={roundsData?.roundsConfig.length}
          >
            Rounds
          </TableHead>
        </TableRow> */}
          <TableRow>
            <TableHead>Position</TableHead>
            <TableHead>Player</TableHead>
            {roundsData?.roundsConfig.map((_, i) => (
              <TableHead key={i}>{i + 1}</TableHead>
            ))}
            <TableHead>Total Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {scoresData.map((item, i) => (
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
              {item[1].scoreRounds.map((score, i) => (
                <TableCell key={score + i}>{score}</TableCell>
              ))}
              {roundsData?.roundsConfig.map((_, i) => {
                if (i + 1 <= roundsData.currentRound) return
                return <TableCell key={i}>{'-'}</TableCell>
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
