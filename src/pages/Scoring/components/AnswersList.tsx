type AnswersListProps = {
  answers: string[]
}

const AnswersList = ({ answers }: AnswersListProps) => {
  return (
    <ul className="flex flex-col gap-1 text-sm min-h-[2.75rem]">
      {answers.map((answer, i) => (
        <li key={answer + i}>{answer}</li>
      ))}
    </ul>
  )
}
export default AnswersList
