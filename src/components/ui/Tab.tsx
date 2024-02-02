import { twMerge } from 'tailwind-merge'

type TabProps = {
  children: React.ReactNode
  isActive: boolean
  label: string
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
  currentUser: boolean
}

const Tab = ({ isActive, onClick, label, currentUser }: TabProps) => {
  return (
    <li
      role="presentation"
      className={twMerge(
        'rounded-t-lg font-bold bg-bg-primary md:text-2xl lg:text-2xl text-lg ',
        !isActive && 'mb-1 mx-1 '
      )}
    >
      <button
        type="button"
        className={twMerge(
          'w-full uppercase py-4 ',
          !isActive && 'text-primary/70 enabled:hover:opacity-70 '
        )}
        onClick={e => onClick(e)}
        role="tab"
        id={`${label}-tab`}
        aria-controls={label}
        aria-selected={isActive}
        disabled={currentUser}
      >
        {label}
      </button>
    </li>
  )
}
export default Tab
