import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useFetchPlayers } from '@/hooks/useFetchPlayers'
import { useLoaderData } from 'react-router-dom'
import UserInfo from '../../../components/ui/UserInfo'
import { RoundsData } from '@/lib/types'

type ResultsTableProps = {
  roundsData: RoundsData
}

const ResultsTable = ({ roundsData }: ResultsTableProps) => {
  const { users, isError, error, isPending } = useFetchPlayers()

  const scoresData = Object.entries(roundsData!.scores).sort(
    (a, b) => b[1].totalScore - a[1].totalScore
  )

  return (
    <Table className="w-full text-left">
      <TableCaption className="caption-top">Results</TableCaption>
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
            <TableCell>
              <UserInfo users={users} userId={item[0]} />
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
  )
}
export default ResultsTable
