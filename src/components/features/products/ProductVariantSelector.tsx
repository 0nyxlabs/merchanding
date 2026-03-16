import type { FC } from 'react'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'
import type { ProductVariant, ProductSize, ProductColor } from '@/types'

interface ProductVariantSelectorProps {
  variants: ProductVariant[]
  selectedSize: ProductSize | null
  selectedColor: ProductColor | null
  onSizeChange: (size: ProductSize) => void
  onColorChange: (color: ProductColor) => void
}

export const ProductVariantSelector: FC<ProductVariantSelectorProps> = ({
  variants,
  selectedSize,
  selectedColor,
  onSizeChange,
  onColorChange,
}) => {
  const sizes = [...new Set(variants.map((v) => v.size))]
  const colors = variants.reduce<ProductColor[]>((acc, v) => {
    if (v.color && !acc.some((c) => c.hex === v.color?.hex)) {
      acc.push(v.color)
    }
    return acc
  }, [])

  return (
    <div className="space-y-4">
      {/* Size selector */}
      <div>
        <Label className="mb-2 block text-sm font-medium">Size</Label>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => {
            const isSelected = selectedSize === size
            return (
              <button
                key={size}
                onClick={() => onSizeChange(size)}
                className={cn(
                  'flex h-10 min-w-10 items-center justify-center rounded-md border px-3 text-sm font-medium transition-colors',
                  isSelected
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-input bg-background hover:bg-accent',
                )}
              >
                {size}
              </button>
            )
          })}
        </div>
      </div>

      {/* Color selector — only shown when variants have color data */}
      {colors.length > 0 && (
        <div>
          <Label className="mb-2 block text-sm font-medium">
            Color{selectedColor ? `: ${selectedColor.name}` : ''}
          </Label>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => {
              const isSelected = selectedColor?.hex === color.hex
              return (
                <button
                  key={color.hex}
                  onClick={() => onColorChange(color)}
                  title={color.name}
                  className={cn(
                    'h-10 w-10 rounded-full border-2 transition-all',
                    isSelected
                      ? 'border-primary ring-2 ring-primary ring-offset-2'
                      : 'border-border',
                  )}
                  style={{ backgroundColor: color.hex }}
                />
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
