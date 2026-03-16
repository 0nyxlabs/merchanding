import type { FC } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { ImageWithFallback } from '@/components/shared/ImageWithFallback'
import { formatCurrency } from '@/utils/formatters'
import type { CampaignProduct } from '@/types'

interface ProductCardProps {
  product: CampaignProduct
  onSelect: (productId: string) => void
}

export const ProductCard: FC<ProductCardProps> = ({ product, onSelect }) => {
  return (
    <Card
      className="group cursor-pointer overflow-hidden py-0 transition-shadow hover:shadow-md"
      onClick={() => onSelect(product.id)}
    >
      <div className="aspect-square overflow-hidden">
        <ImageWithFallback
          src={product.thumbnailUrl ?? ''}
          alt={product.productType}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold capitalize leading-tight">{product.productType}</h3>
        <p className="mt-1 text-sm font-medium text-primary">
          {formatCurrency(product.retailPrice)}
        </p>
      </CardContent>
    </Card>
  )
}
