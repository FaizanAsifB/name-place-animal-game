import { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

type TextProps = {
  children: ReactNode
  className?: string
}
export function P({ children, className = '' }: TextProps) {
  return <p className={twMerge('leading-7', className)}>{children}</p>
}

export function Lead({ children, className }: TextProps) {
  return (
    <p className={twMerge('text-xl text-muted-foreground', className)}>
      {children}
    </p>
  )
}

export function Large({ children, className }: TextProps) {
  return (
    <div className={twMerge('text-lg font-semibold', className)}>
      {children}
    </div>
  )
}

export function Small({ children, className }: TextProps) {
  return (
    <small className={twMerge('text-sm font-medium leading-none', className)}>
      {children}
    </small>
  )
}

export function Muted({ children, className }: TextProps) {
  return (
    <p className={twMerge('text-sm text-muted-foreground', className)}>
      {children}
    </p>
  )
}
