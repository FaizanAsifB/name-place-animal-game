import { useLoaderData } from 'react-router-dom'
import UserInfo from '../../../components/ui/UserInfo'
import { GameData, RoundsData } from '../../../lib/types'

const ResultsTable = () => {
  const { roundsData } = useLoaderData() as { roundsData: RoundsData }
  const scoresData = Object.entries(roundsData!.scores).sort(
    (a, b) => b[1].totalScore - a[1].totalScore
  )

  return (
    <table className="w-full text-left">
      <caption>Results</caption>
      <thead>
        <tr>
          <th></th>
          <th></th>
          <th colSpan={roundsData?.roundsConfig.length}>Rounds</th>
        </tr>
        <tr>
          <th>Position</th>
          <th>User</th>
          {roundsData?.roundsConfig.map((_, i) => (
            <th key={i}>{i + 1}</th>
          ))}
          <th>Total Score</th>
        </tr>
      </thead>
      <tbody>
        {scoresData.map((item, i) => (
          <tr key={item[0]}>
            <td>{i + 1}</td>
            <td>
              <UserInfo userId={item[0]} />
            </td>
            {item[1].scoreRounds.map((score, i) => (
              <td key={score + i}>{score}</td>
            ))}
            {roundsData?.roundsConfig.map((_, i) => {
              if (i + 1 <= roundsData.currentRound) return
              return <td key={i}>{'-'}</td>
            })}
            <td>{item[1].totalScore}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
export default ResultsTable
