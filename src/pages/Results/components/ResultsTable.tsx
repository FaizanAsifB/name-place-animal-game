import { H1 } from '@/components/typography/Headings'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ScoreData } from '@/lib/types'
import { getBonusPoints } from '@/utils/helpers'
import UserInfo from '../../../components/ui/UserInfo'

type ResultsTableProps = {
  scoresData: [string, ScoreData][]
  isLastRound: boolean
  currentRound: number
  endMode: string
  bonusPoints: Record<string, Record<string, string>>
}

const ResultsTable = ({
  scoresData,
  isLastRound,
  currentRound,
  endMode,
  bonusPoints,
}: ResultsTableProps) => {
  return (
    <Table>
      <TableCaption className="caption-top">
        <H1>Results</H1>
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Position</TableHead>
          <TableHead>Player</TableHead>
          <TableHead>Current Round</TableHead>
          {endMode === 'Fastest Finger' && <TableHead>Total Bonus</TableHead>}
          <TableHead>Total Score</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {scoresData?.map((item, i) => (
          <TableRow key={item[0]}>
            <TableCell>{i + 1}.</TableCell>
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
            {/* Current Round score */}
            <TableCell>{item[1].scoreRounds[currentRound - 1]}</TableCell>
            {/* Bonus Points */}
            {endMode === 'Fastest Finger' && (
              <TableCell>{getBonusPoints(bonusPoints, item[0])}</TableCell>
            )}
            {/* Total score */}
            <TableCell>{item[1].totalScore}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
export default ResultsTable
