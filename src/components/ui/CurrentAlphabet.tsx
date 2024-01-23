import { twMerge } from 'tailwind-merge'
import { H2 } from '../typography/Headings'

type CurrentAlphabetProps = {
  currentAlphabet: string
  className?: string
}

const CurrentAlphabet = ({
  currentAlphabet,
  className = '',
}: CurrentAlphabetProps) => {
  return (
    <H2
      className={twMerge(
        'grid w-12 h-12 border-4 rounded-full border-accent place-items-center',
        className
      )}
    >
      {currentAlphabet}
    </H2>
  )
}
export default CurrentAlphabet
