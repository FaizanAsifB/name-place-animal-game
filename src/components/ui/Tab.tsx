type TabProps = {
  children: React.ReactNode
  isActive: boolean
  label: string
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
  currentUser: boolean
}

const Tab = ({ isActive, onClick, label, currentUser }: TabProps) => {
  let activeStyling =
    'rounded-t-lg bg-background font-bold text-xl md:text-2xl lg:text-3xl'
  isActive ? activeStyling : (activeStyling += ' mb-2')

  return (
    <li role="presentation" className={activeStyling}>
      <button
        type="button"
        className="w-full py-4 capitalize"
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
