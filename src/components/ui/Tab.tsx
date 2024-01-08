type TabProps = {
  children: React.ReactNode
  isActive: boolean
  label: string
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
  currentUser: boolean
}

const Tab = ({ isActive, onClick, label, currentUser }: TabProps) => {
  let activeStyling =
    'rounded-t-lg font-bold bg-bg-primary md:text-xl lg:text-2xl '
  isActive ? activeStyling : (activeStyling += 'mb-1 mx-1 hover:opacity-90')

  return (
    <li role="presentation" className={activeStyling}>
      <button
        type="button"
        className={`w-full py-4 capitalize ${!isActive && 'text-primary/70'}`}
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
