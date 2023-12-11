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
      className="flex gap-4 btn"
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
