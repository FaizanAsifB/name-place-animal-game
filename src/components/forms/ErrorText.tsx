const ErrorText = ({ children }: { children?: React.ReactNode }) => {
  return <>{children && <p className="text-xs text-red-500">{children}</p>}</>
}
export default ErrorText
