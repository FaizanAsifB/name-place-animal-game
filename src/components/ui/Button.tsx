type ButtonProps = {
  children: React.ReactNode
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  type?: 'button' | 'submit'
  name?: string | ''
  disabled?: boolean
  icon?: React.ReactNode
}

const Button = ({
  children,
  onClick,
  type = 'button',
  name = '',
  icon,
  disabled,
}: ButtonProps) => {
  return (
    <button
      className="flex items-center gap-4 px-6 py-3 text-xl border-4 rounded-lg lg:text-2xl border-accent3 bg-accent text-light max-w-max"
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
