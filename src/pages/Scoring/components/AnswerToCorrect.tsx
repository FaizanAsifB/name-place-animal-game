import { Answers } from '../../../lib/types'

type AnswerToCorrectAnswerProps = {
  answers: string[]
}

const AnswerToCorrect = ({ answers }: AnswerToCorrectAnswerProps) => {
  return (
    <ul className="flex gap-4 border-2 border-b-black">
      {answers.map((answer, index) => (
        <li key={index}>{!answer ? 'Garam Anday🥚' : answer}</li>
      ))}
    </ul>
  )
}
export default AnswerToCorrect
