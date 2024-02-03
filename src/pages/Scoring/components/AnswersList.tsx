type AnswersListProps = {
  answers: string[]
  otherAnswers: string[]
}

const AnswersList = ({ answers, otherAnswers }: AnswersListProps) => {
  return (
    <ul className="flex flex-col gap-1 text-base lg:text-xl min-h-[2.75rem] text-foreground">
      {answers
        .filter((answer, i) => answers.indexOf(answer) === i)
        .map((answer, i) => (
          <li
            key={answer + i}
            className={`w-fit ${
              otherAnswers && otherAnswers.includes(answer) && i === 0
                ? 'bg-yellow-500'
                : otherAnswers && otherAnswers.includes(answer) && i === 1
                ? 'bg-lime-500'
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
