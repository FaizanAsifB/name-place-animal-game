type ErrorTextProps = {
  children?: React.ReactNode
  align?: string
}

const ErrorText = ({ children, align = 'right' }: ErrorTextProps) => {
  return (
    <p
      className={`absolute mb-1 text-xs text-orange-700 bottom-full ${align}-0`}
    >
      {children}
    </p>
  )
}
export default ErrorText
