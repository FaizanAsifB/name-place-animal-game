type ButtonProps = {
  children: React.ReactNode
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  type?: 'button' | 'submit'
  name?: string | ''
  disabled?: boolean
  icon?: React.ReactNode
  className?: string
}

const Button = ({
  children,
  onClick,
  type = 'button',
  name = '',
  icon,
  disabled,
  className,
}: ButtonProps) => {
  return (
    <button
      className={`flex items-center gap-4 px-6 py-3 text-xl border-4 rounded-lg lg:text-2xl border-accent bg-secondary text-white max-w-max ${className}`}
      onClick={onClick}
      type={type}
      name={name}
      disabled={disabled}
    >
      {icon}
      <span className="w-18">{children}</span>
    </button>
  )
}
export default Button
