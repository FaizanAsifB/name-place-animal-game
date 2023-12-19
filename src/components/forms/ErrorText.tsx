const ErrorText = ({ children }: { children?: React.ReactNode }) => {
  return (
    <p className="absolute mb-1 text-xs text-white bottom-full">{children}</p>
  )
}
export default ErrorText
