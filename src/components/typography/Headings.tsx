import { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

type HeadingProps = {
  children: ReactNode
  className?: string
}

export function H1({ children, className = '' }: HeadingProps) {
  return (
    <h1
      className={twMerge(
        'text-4xl font-extrabold tracking-tight scroll-m-20 md:text-5xl',
        className
      )}
    >
      {children}
    </h1>
  )
}
export function H2({ children, className }: HeadingProps) {
  return (
    <h2
      className={twMerge(
        'text-3xl font-semibold tracking-tight scroll-m-20 first:mt-0 md:text-4xl',
        className
      )}
    >
      {children}
    </h2>
  )
}

export function H3({ children, className }: HeadingProps) {
  return (
    <h3
      className={twMerge(
        'text-2xl font-semibold tracking-tight scroll-m-20 md:text-3xl',
        className
      )}
    >
      {children}
    </h3>
  )
}

export function H4({ children, className }: HeadingProps) {
  return (
    <h4
      className={twMerge(
        'text-xl font-semibold tracking-tight scroll-m-20 md:text-2xl',
        className
      )}
    >
      {children}
    </h4>
  )
}
export function H5({ children, className }: HeadingProps) {
  return (
    <h5
      className={twMerge(
        'text-lg font-semibold tracking-tight scroll-m-20 md:text-xl',
        className
      )}
    >
      {children}
    </h5>
  )
}

export function H6({ children, className }: HeadingProps) {
  return (
    <h6
      className={twMerge(
        'text-lg font-semibold tracking-normal scroll-m-20 md:text-xl',
        className
      )}
    >
      {children}
    </h6>
  )
}
