type AnswersListProps = {
  answers: string[]
  otherAnswers: string[]
}

const AnswersList = ({ answers, otherAnswers }: AnswersListProps) => {
  return (
    <ul className="flex flex-col gap-1 text-base lg:text-xl min-h-[2.75rem]">
      {answers.map((answer, i) => (
        <li
          key={answer + i}
          className={`w-fit ${
            otherAnswers && otherAnswers.includes(answer) && i === 0
              ? 'bg-yellow-600'
              : otherAnswers && otherAnswers.includes(answer) && i === 1
              ? 'bg-blue-400'
              : ''
          }`}
        >
          {answer}
        </li>
      ))}
    </ul>
  )
}
export default AnswersList
