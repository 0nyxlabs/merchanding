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
  // Extract unique sizes and colors from variants
  const sizes = [...new Set(variants.map((v) => v.size))]
  const colors = variants.reduce<ProductColor[]>((acc, v) => {
    if (!acc.some((c) => c.hex === v.color.hex)) {
      acc.push(v.color)
    }
    return acc
  }, [])

  // Find the selected variant to check stock
  const selectedVariant = variants.find(
    (v) => v.size === selectedSize && v.color.hex === selectedColor?.hex,
  )

  // Check if a size is available for the selected color
  const isSizeAvailable = (size: ProductSize) => {
    if (!selectedColor) return variants.some((v) => v.size === size && v.stock > 0)
    return variants.some(
      (v) => v.size === size && v.color.hex === selectedColor.hex && v.stock > 0,
    )
  }

  // Check if a color is available for the selected size
  const isColorAvailable = (color: ProductColor) => {
    if (!selectedSize) return variants.some((v) => v.color.hex === color.hex && v.stock > 0)
    return variants.some(
      (v) => v.color.hex === color.hex && v.size === selectedSize && v.stock > 0,
    )
  }

  return (
    <div className="space-y-4">
      {/* Size selector */}
      <div>
        <Label className="mb-2 block text-sm font-medium">Size</Label>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => {
            const available = isSizeAvailable(size)
            const isSelected = selectedSize === size
            return (
              <button
                key={size}
                onClick={() => onSizeChange(size)}
                disabled={!available}
                className={cn(
                  'flex h-10 min-w-10 items-center justify-center rounded-md border px-3 text-sm font-medium transition-colors',
                  isSelected
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-input bg-background hover:bg-accent',
                  !available && 'cursor-not-allowed opacity-40 line-through',
                )}
              >
                {size}
              </button>
            )
          })}
        </div>
      </div>

      {/* Color selector */}
      <div>
        <Label className="mb-2 block text-sm font-medium">
          Color{selectedColor ? `: ${selectedColor.name}` : ''}
        </Label>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => {
            const available = isColorAvailable(color)
            const isSelected = selectedColor?.hex === color.hex
            return (
              <button
                key={color.hex}
                onClick={() => onColorChange(color)}
                disabled={!available}
                title={color.name}
                className={cn(
                  'h-10 w-10 rounded-full border-2 transition-all',
                  isSelected ? 'border-primary ring-2 ring-primary ring-offset-2' : 'border-border',
                  !available && 'cursor-not-allowed opacity-40',
                )}
                style={{ backgroundColor: color.hex }}
              />
            )
          })}
        </div>
      </div>

      {/* Stock info */}
      {selectedVariant && (
        <p className="text-sm text-muted-foreground">
          {selectedVariant.stock > 0
            ? `${selectedVariant.stock} in stock`
            : 'Out of stock'}
        </p>
      )}
    </div>
  )
}
