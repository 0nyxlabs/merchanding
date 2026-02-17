import { useState } from 'react'
import type { ImgHTMLAttributes } from 'react'
import { ImageOff } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageWithFallbackProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'alt'> {
  alt: string
  fallbackSrc?: string
}

export const ImageWithFallback = ({
  src,
  alt,
  fallbackSrc,
  className,
  ...props
}: ImageWithFallbackProps) => {
  const [hasError, setHasError] = useState(false)
  const [usedFallback, setUsedFallback] = useState(false)

  const handleError = () => {
    if (!hasError && fallbackSrc && !usedFallback) {
      setUsedFallback(true)
      return
    }
    setHasError(true)
  }

  if (hasError) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-muted text-muted-foreground',
          className,
        )}
        role="img"
        aria-label={alt}
      >
        <ImageOff className="h-8 w-8" />
      </div>
    )
  }

  const imgSrc = usedFallback ? fallbackSrc : src

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
      loading="lazy"
      {...props}
    />
  )
}
