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
import { VoteButton } from '@/components/features/designs/VoteButton'
import { CommentSection } from '@/components/features/designs/CommentSection'
import { useCampaign } from '@/hooks/useCampaigns'
import { useCampaignProducts, useCampaignProduct } from '@/hooks/useProducts'
import { useDesignsByCampaign } from '@/hooks/useDesigns'
import { useCartStore } from '@/store/cartStore'
import { formatCurrency } from '@/utils/formatters'
import { toast } from 'react-hot-toast'
import type { ProductSize } from '@/types'

export const Route = createFileRoute('/campaigns/$campaignId')({
  component: CampaignDetailPage,
})

const ACTIVE_STATUSES: string[] = ['open', 'voting', 'presale']
const SIZES: ProductSize[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

function CampaignDetailPage() {
  const { campaignId } = Route.useParams()
  const { data: campaign, isLoading: campaignLoading } = useCampaign(campaignId)
  const { data: products, isLoading: productsLoading } = useCampaignProducts(campaignId)
  const { data: designs, isLoading: designsLoading } = useDesignsByCampaign(campaignId)

  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)
  const [selectedDesignId, setSelectedDesignId] = useState<string | null>(null)

  const isVotingPhase = campaign?.status === 'voting'

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

  const isActive = ACTIVE_STATUSES.includes(campaign.status)

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
            src={campaign.coverImageUrl ?? ''}
            alt={campaign.name}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-col justify-center">
          <Badge variant={isActive ? 'default' : 'outline'} className="mb-3 w-fit capitalize">
            {campaign.status}
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight">{campaign.name}</h1>
          <p className="mt-3 text-muted-foreground">{campaign.description}</p>
          <p className="mt-4 text-sm text-muted-foreground">
            {campaign.totalPreorders}{' '}
            {campaign.totalPreorders === 1 ? 'preorder' : 'preorders'}
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
          campaignId={campaignId}
          productId={selectedProductId}
          onClose={() => setSelectedProductId(null)}
        />
      )}

      {/* Voting section — only during voting phase */}
      {isVotingPhase && (
        <>
          <Separator className="mb-8 mt-8" />
          <h2 className="mb-6 text-2xl font-bold">Vote for Designs</h2>
          {designsLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-square w-full rounded-xl" />
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-8 w-24" />
                </div>
              ))}
            </div>
          ) : !designs?.length ? (
            <EmptyState
              title="No designs submitted yet"
              description="Check back once designers submit their work."
            />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {designs.map((design) => (
                <div
                  key={design.id}
                  className="overflow-hidden rounded-xl border cursor-pointer"
                  onClick={() =>
                    setSelectedDesignId(selectedDesignId === design.id ? null : design.id)
                  }
                >
                  <div className="aspect-square overflow-hidden">
                    <ImageWithFallback
                      src={design.thumbnailUrl ?? design.originalFileUrl}
                      alt={design.title}
                      className="h-full w-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <div className="flex items-center justify-between p-3">
                    <p className="truncate text-sm font-medium">{design.title}</p>
                    <VoteButton
                      designId={design.id}
                      campaignId={campaignId}
                      votesCount={design.votesCount}
                    />
                  </div>

                  {selectedDesignId === design.id && (
                    <div
                      className="border-t p-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <CommentSection designId={design.id} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

function ProductDetailPanel({
  campaignId,
  productId,
  onClose,
}: {
  campaignId: string
  productId: string
  onClose: () => void
}) {
  const { data: product, isLoading } = useCampaignProduct(campaignId, productId)
  const addItem = useCartStore((s) => s.addItem)
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null)

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

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Please select a size')
      return
    }

    addItem({
      id: product.id,
      campaignId,
      designId: product.designId,
      designTitle: product.productType,
      productType: product.productType,
      size: selectedSize,
      price: product.retailPrice,
      quantity: 1,
      thumbnailUrl: product.thumbnailUrl,
    })
    toast.success('Added to cart!')
    onClose()
  }

  return (
    <div className="mt-8 rounded-xl border p-6">
      <div className="grid gap-8 md:grid-cols-2">
        {/* Product thumbnail */}
        <div className="aspect-square overflow-hidden rounded-lg bg-muted">
          <ImageWithFallback
            src={product.thumbnailUrl ?? ''}
            alt={product.productType}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Product info */}
        <div>
          <div className="mb-1 flex items-start justify-between">
            <h3 className="text-2xl font-bold capitalize">{product.productType}</h3>
            <button
              onClick={onClose}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Close
            </button>
          </div>
          <p className="mb-6 text-lg font-semibold text-primary">
            {formatCurrency(product.retailPrice)}
          </p>

          {/* Size selector */}
          <div className="mb-6">
            <p className="mb-2 text-sm font-medium">Size</p>
            <div className="flex flex-wrap gap-2">
              {SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`flex h-10 min-w-[2.5rem] items-center justify-center rounded-md border px-3 text-sm font-medium transition-colors ${
                    selectedSize === size
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-input bg-background hover:bg-accent'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <Button
            className="w-full"
            size="lg"
            onClick={handleAddToCart}
            disabled={!selectedSize}
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
