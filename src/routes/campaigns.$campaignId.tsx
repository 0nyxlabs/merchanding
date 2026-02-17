import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { ArrowLeft, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { ImageWithFallback } from '@/components/shared/ImageWithFallback'
import { EmptyState } from '@/components/shared/EmptyState'
import { ProductCard } from '@/components/features/products/ProductCard'
import { ProductVariantSelector } from '@/components/features/products/ProductVariantSelector'
import { useCampaign } from '@/hooks/useCampaigns'
import { useProductsByCampaign, useProduct } from '@/hooks/useProducts'
import { useCartStore } from '@/store/cartStore'
import { formatCurrency } from '@/utils/formatters'
import { toast } from 'react-hot-toast'
import type { ProductSize, ProductColor } from '@/types'

export const Route = createFileRoute('/campaigns/$campaignId')({
  component: CampaignDetailPage,
})

function CampaignDetailPage() {
  const { campaignId } = Route.useParams()
  const { data: campaign, isLoading: campaignLoading } = useCampaign(campaignId)
  const { data: products, isLoading: productsLoading } = useProductsByCampaign(campaignId)

  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)

  if (campaignLoading) {
    return <CampaignDetailSkeleton />
  }

  if (!campaign) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <EmptyState
          title="Campaign not found"
          description="The campaign you're looking for doesn't exist or has been removed."
          action={
            <Button asChild>
              <Link to="/browse">Back to Browse</Link>
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Back link */}
      <Link
        to="/browse"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Browse
      </Link>

      {/* Campaign header */}
      <div className="mb-8 grid gap-8 lg:grid-cols-2">
        <div className="aspect-[4/3] overflow-hidden rounded-xl">
          <ImageWithFallback
            src={campaign.imageUrl}
            alt={campaign.name}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-col justify-center">
          <Badge variant={campaign.status === 'active' ? 'default' : 'outline'} className="mb-3 w-fit">
            {campaign.status}
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight">{campaign.name}</h1>
          <p className="mt-3 text-muted-foreground">{campaign.description}</p>
          <p className="mt-4 text-sm text-muted-foreground">
            {campaign.productCount} {campaign.productCount === 1 ? 'product' : 'products'} available
          </p>
        </div>
      </div>

      <Separator className="mb-8" />

      {/* Products section */}
      <h2 className="mb-6 text-2xl font-bold">Products</h2>

      {productsLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-square w-full rounded-xl" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : !products?.length ? (
        <EmptyState
          title="No products yet"
          description="This campaign doesn't have any products available."
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={setSelectedProductId}
            />
          ))}
        </div>
      )}

      {/* Product detail panel */}
      {selectedProductId && (
        <ProductDetailPanel
          productId={selectedProductId}
          onClose={() => setSelectedProductId(null)}
        />
      )}
    </div>
  )
}

function ProductDetailPanel({
  productId,
  onClose,
}: {
  productId: string
  onClose: () => void
}) {
  const { data: product, isLoading } = useProduct(productId)
  const addItem = useCartStore((s) => s.addItem)
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null)
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null)

  if (isLoading) {
    return (
      <div className="mt-8 rounded-xl border p-6">
        <Skeleton className="mb-4 h-6 w-48" />
        <Skeleton className="mb-2 h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    )
  }

  if (!product) return null

  const selectedVariant = product.variants.find(
    (v) => v.size === selectedSize && v.color.hex === selectedColor?.hex,
  )

  const handleAddToCart = () => {
    if (!selectedVariant) {
      toast.error('Please select a size and color')
      return
    }

    if (selectedVariant.stock <= 0) {
      toast.error('This variant is out of stock')
      return
    }

    addItem({
      id: selectedVariant.id,
      name: product.name,
      price: selectedVariant.price,
      quantity: 1,
      image: product.images[0],
      variantId: selectedVariant.id,
    })
    toast.success('Added to cart!')
  }

  return (
    <div className="mt-8 rounded-xl border p-6">
      <div className="grid gap-8 md:grid-cols-2">
        {/* Product images */}
        <div className="aspect-square overflow-hidden rounded-lg">
          <ImageWithFallback
            src={product.images[0] ?? ''}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Product info + variant selector */}
        <div>
          <div className="mb-1 flex items-start justify-between">
            <h3 className="text-2xl font-bold">{product.name}</h3>
            <button
              onClick={onClose}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Close
            </button>
          </div>
          <p className="mb-4 text-lg font-semibold text-primary">
            {formatCurrency(selectedVariant?.price ?? product.basePrice)}
          </p>
          <p className="mb-6 text-sm text-muted-foreground">{product.description}</p>

          <ProductVariantSelector
            variants={product.variants}
            selectedSize={selectedSize}
            selectedColor={selectedColor}
            onSizeChange={setSelectedSize}
            onColorChange={setSelectedColor}
          />

          <Button
            className="mt-6 w-full"
            size="lg"
            onClick={handleAddToCart}
            disabled={!selectedVariant || selectedVariant.stock <= 0}
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  )
}

function CampaignDetailSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Skeleton className="mb-6 h-4 w-32" />
      <div className="mb-8 grid gap-8 lg:grid-cols-2">
        <Skeleton className="aspect-[4/3] w-full rounded-xl" />
        <div className="space-y-4">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-9 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </div>
  )
}
