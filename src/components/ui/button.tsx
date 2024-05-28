import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-lg lg:text-2xl font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground hover:bg-primary-light  flex gap-4 shadow-[0_6px_0px_0px] shadow-secondary active:translate-y-1 active:shadow-[0_2px_0px_0px] active:shadow-secondary uppercase relative active:before:w-full active:before:h-1 active:before:absolute active:before:bottom-full font-pressStart2P',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border-2 border-primary bg-orange-700/60 flex gap-2 items-center  hover:bg-primary/10 hover:border-primary',
        secondary: 'bg-secondary  hover:bg-secondary/80 hover: flex gap-2',
        ghost: 'text-primary hover:text-foreground',
        link: 'text-foreground underline-offset-4 rounded-none hover:shadow-[0_1px_0_#000]',
        icon: 'bg-accent text-accent-foreground hover:bg-accent/80 active:scale-90',
      },
      size: {
        default: 'h-12 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        md: 'h-10 px-4 py-2 rounded-md',
        lg: 'h-11 rounded-md px-8',
        none: 'w-fit h-fit',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

// eslint-disable-next-line react-refresh/only-export-components
export { Button, buttonVariants }
