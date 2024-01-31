type AnswersListProps = {
  answers: string[]
  otherAnswers: string[]
}

const AnswersList = ({ answers, otherAnswers }: AnswersListProps) => {
  return (
    <ul className="flex flex-col gap-1 text-sm lg:text-base min-h-[2.75rem]">
      {answers.map((answer, i) => (
        <li
          key={answer + i}
          className={`w-fit ${
            otherAnswers.includes(answer) ? 'bg-yellow-500' : ''
          }`}
        >
          {answer}
        </li>
      ))}
    </ul>
  )
}
export default AnswersList
