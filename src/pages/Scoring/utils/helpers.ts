import { UserAnswers } from '../../../lib/types'

export const getScoringData = (answers: UserAnswers[], currentUser: string) => {
  const currentUserIndex = answers.findIndex(
    item => Object.keys(item)[0] === currentUser
  )

  //Index of user to correct
  const indexToCorrect =
    currentUserIndex === answers.length - 1 ? 0 : currentUserIndex + 1
  // The User object to correct

  const userIdToCorrect = Object.keys(answers[indexToCorrect])[0]
  const answersToCorrect = Object.values(answers[indexToCorrect])[0]
  const otherUsers = answers.filter((_, i) => i !== indexToCorrect)

  const otherAnswers: Record<string, string[]> = {}

  otherUsers
    .flatMap(item => {
      return Object.values(item)
    })
    .flatMap(item => item)
    .forEach(item => {
      if (!otherAnswers[item.title])
        return (otherAnswers[item.title] = item.answers)

      return (otherAnswers[item.title] = [
        ...otherAnswers[item.title],
        ...item.answers,
      ])
    })
  return { userIdToCorrect, answersToCorrect, otherAnswers }
}
