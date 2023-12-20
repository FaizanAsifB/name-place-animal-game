const ErrorText = ({ children }: { children?: React.ReactNode }) => {
  return (
    <p className="absolute right-0 mb-1 text-xs text-orange-700 bottom-full">
      {children}
    </p>
  )
}
export default ErrorText
