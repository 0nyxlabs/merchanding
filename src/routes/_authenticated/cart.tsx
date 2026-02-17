import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { ShoppingBag, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { CartItem } from '@/components/features/cart/CartItem'
import { CartSummary } from '@/components/features/cart/CartSummary'
import { EmptyState } from '@/components/shared/EmptyState'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { useCart } from '@/hooks/useCart'

export const Route = createFileRoute('/_authenticated/cart')({
  component: CartPage,
})

function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart, calculateTotals, isEmpty } = useCart()
  const totals = calculateTotals()
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h2 className="text-3xl font-bold tracking-tight">Shopping Cart</h2>

      {isEmpty ? (
        <EmptyState
          icon={<ShoppingBag className="h-12 w-12" />}
          title="Your cart is empty"
          description="Browse campaigns to find products you love."
          action={
            <Button asChild>
              <Link to="/browse">Browse Campaigns</Link>
            </Button>
          }
          className="mt-8"
        />
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {/* Cart items */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {totals.itemCount} {totals.itemCount === 1 ? 'item' : 'items'}
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowClearConfirm(true)}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="mr-1 h-4 w-4" />
                Clear Cart
              </Button>
            </div>
            <Separator className="my-4" />
            <div className="divide-y">
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeFromCart}
                />
              ))}
            </div>
          </div>

          {/* Order summary */}
          <div className="rounded-xl border p-6">
            <h3 className="mb-4 font-semibold">Order Summary</h3>
            <CartSummary totals={totals} />
            <Button asChild className="mt-6 w-full" size="lg">
              <Link to="/checkout">Proceed to Checkout</Link>
            </Button>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Free shipping on orders over $50
            </p>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={showClearConfirm}
        onOpenChange={setShowClearConfirm}
        title="Clear cart"
        description="Are you sure you want to remove all items from your cart? This action cannot be undone."
        confirmLabel="Clear Cart"
        onConfirm={clearCart}
      />
    </div>
  )
}
