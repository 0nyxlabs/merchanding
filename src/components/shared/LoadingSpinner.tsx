import type { FC } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
} as const

interface LoadingSpinnerProps {
  text?: string
  size?: keyof typeof sizeClasses
  className?: string
}

export const LoadingSpinner: FC<LoadingSpinnerProps> = ({
  text,
  size = 'md',
  className,
}) => {
  return (
    <div
      role="status"
      aria-label={text ?? 'Loading'}
      className={cn('flex flex-col items-center justify-center gap-2', className)}
    >
      <Loader2 className={cn('animate-spin text-muted-foreground', sizeClasses[size])} />
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
    </div>
  )
}
