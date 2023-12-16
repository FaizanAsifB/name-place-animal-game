import { useLoaderData } from 'react-router-dom'
import { GameData } from '../../../lib/types'

const ResultsTable = () => {
  const { gameData } = useLoaderData() as { gameData: GameData }
  const scoresData = Object.entries(gameData!.scores).sort(
    (a, b) => b[1].totalScore - a[1].totalScore
  )

  console.log(scoresData)

  return (
    <table>
      <thead>
        <tr>
          <th>Position</th>
          <th>User</th>
          {gameData?.rounds.map((_, i) => (
            <th key={i}>Round{i + 1}</th>
          ))}
          <th>Total Score</th>
        </tr>
      </thead>
      <tbody>
        {scoresData.map((item, i) => (
          <tr key={item[0]}>
            <td>{i + 1}</td>
            <td>{item[0]}</td>
            {item[1].scoreRounds.map((score, i) => (
              <td key={score + i}>{score}</td>
            ))}
            {gameData?.rounds.map((_, i) => {
              if (i + 1 <= gameData.currentRound) return
              return <td key={i}>-</td>
            })}
            <td>{item[1].totalScore}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
export default ResultsTable
