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
        'rounded-t-lg font-bold bg-bg-primary lg:text-lg text-base px-1 xl:text-2xl py-1 xl:py-2',
        !isActive && 'mb-1 mx-1 xl:mb-2 xl:mx-2'
      )}
    >
      <button
        type="button"
        className={twJoin(
          'w-full uppercase py-2 ',
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
