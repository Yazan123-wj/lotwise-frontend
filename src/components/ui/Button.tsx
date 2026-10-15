import type { ButtonHTMLAttributes } from 'react'
import { cx } from '@/utils/cx'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost'
type ButtonSize = 'md' | 'lg'

export function buttonClass(variant: ButtonVariant = 'primary', className?: string, size: ButtonSize = 'md') {
  return cx(
    'inline-flex items-center justify-center gap-2 px-5 text-sm font-medium transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-royal disabled:cursor-not-allowed disabled:opacity-40',
    size === 'lg' ? 'min-h-12' : 'min-h-11',
    variant === 'primary' && 'bg-royal text-white hover:bg-navy',
    variant === 'secondary' && 'border border-wire-line bg-white text-navy hover:border-royal',
    variant === 'outline' && 'border border-navy/20 bg-white text-navy hover:border-navy hover:bg-navy hover:text-white',
    variant === 'ghost' && 'bg-transparent px-2 text-navy hover:text-royal',
    className,
  )
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
}

export function Button({ variant = 'primary', size = 'md', className, type = 'button', ...props }: ButtonProps) {
  return <button type={type} className={buttonClass(variant, className, size)} {...props} />
}
