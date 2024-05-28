import { twMerge } from 'tailwind-merge'

type CurrentAlphabetProps = {
  currentAlphabet: string
  className?: string
}

const CurrentAlphabet = ({
  currentAlphabet,
  className = '',
}: CurrentAlphabetProps) => {
  return (
    <p
      className={twMerge(
        'border-4 rounded-full border-accent p-1 text-4xl w-14 text-center aspect-square',
        className
      )}
    >
      {currentAlphabet}
    </p>
  )
}
export default CurrentAlphabet
