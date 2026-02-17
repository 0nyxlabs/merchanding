import type { FC } from 'react'
import { Link } from '@tanstack/react-router'
import { ShoppingBag } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { CartItem } from './CartItem'
import { CartSummary } from './CartSummary'
import { EmptyState } from '@/components/shared/EmptyState'
import { useCart } from '@/hooks/useCart'
import { useUIStore } from '@/store/uiStore'

export const CartDrawer: FC = () => {
  const { isCartDrawerOpen, closeCartDrawer } = useUIStore()
  const { items, removeFromCart, updateQuantity, calculateTotals, isEmpty } = useCart()

  const totals = calculateTotals()

  return (
    <Sheet open={isCartDrawerOpen} onOpenChange={closeCartDrawer}>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Shopping Cart</SheetTitle>
          <SheetDescription>
            {totals.itemCount} {totals.itemCount === 1 ? 'item' : 'items'}
          </SheetDescription>
        </SheetHeader>

        {isEmpty ? (
          <div className="flex flex-1 items-center justify-center">
            <EmptyState
              icon={<ShoppingBag className="h-10 w-10" />}
              title="Your cart is empty"
              description="Browse campaigns to find products you love."
              action={
                <Button asChild variant="outline" onClick={closeCartDrawer}>
                  <Link to="/browse">Browse Campaigns</Link>
                </Button>
              }
            />
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-4">
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

            <SheetFooter className="border-t">
              <CartSummary totals={totals} />
              <Separator />
              <div className="flex flex-col gap-2">
                <Button asChild onClick={closeCartDrawer}>
                  <Link to="/cart">View Cart</Link>
                </Button>
                <Button asChild variant="outline" onClick={closeCartDrawer}>
                  <Link to="/checkout">Checkout</Link>
                </Button>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
