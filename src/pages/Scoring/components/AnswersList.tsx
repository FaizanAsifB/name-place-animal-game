type AnswersListProps = {
  answers: string[]
}

const AnswersList = ({ answers }: AnswersListProps) => {
  return (
    <ul className="flex gap-4 border-2 border-b-black">
      {answers.map((answer, index) => (
        <li key={answer + index}>{!answer ? 'Garam Anday🥚' : answer}</li>
      ))}
    </ul>
  )
}
export default AnswersList
