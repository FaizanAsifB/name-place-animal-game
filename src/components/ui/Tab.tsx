import { twJoin } from 'tailwind-merge'

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
      className={twJoin(
        'rounded-t-lg font-bold bg-bg-primary md:text-xl lg:text-2xl text-lg ',
        !isActive && 'mb-1 mx-1 '
      )}
    >
      <button
        type="button"
        className={twJoin(
          'w-full uppercase py-2 lg:py-4 ',
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
