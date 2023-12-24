import { RoundsData } from '../../../lib/types'

export const getScoringData = (
  roundData: RoundsData,
  currentRound: number,
  currentUser: string | undefined
) => {
  if (!roundData) return
  const answers = roundData.answers[`round${currentRound}`]
  const currentUserIndex = answers.findIndex(
    item => Object.keys(item)[0] === currentUser
  )

  //Index of user to correct
  const indexToCorrect =
    currentUserIndex === answers.length - 1 ? 0 : currentUserIndex + 1

  // The User object to correct
  const userToCorrect = Object.entries(answers[indexToCorrect])[0]

  const otherUsers = answers
    .filter((_, i) => i !== indexToCorrect)
    .map(item => {
      return Object.entries(item)[0]
    })

  const userIdToCorrect = userToCorrect[0]
  const answersToCorrect = userToCorrect[1]
  return { userIdToCorrect, answersToCorrect, otherUsers }
}
