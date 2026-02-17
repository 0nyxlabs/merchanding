import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/shared/EmptyState'
import { CheckoutForm } from '@/components/features/checkout/CheckoutForm'
import { useCart } from '@/hooks/useCart'
import { ShoppingBag } from 'lucide-react'

export const Route = createFileRoute('/_authenticated/checkout')({
  component: CheckoutPage,
})

function CheckoutPage() {
  const { isEmpty } = useCart()

  if (isEmpty) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <EmptyState
          icon={<ShoppingBag className="h-12 w-12" />}
          title="Your cart is empty"
          description="Add some items to your cart before checking out."
          action={
            <Button asChild>
              <Link to="/browse">Browse Campaigns</Link>
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h2 className="mb-8 text-3xl font-bold tracking-tight">Checkout</h2>
      <CheckoutForm />
    </div>
  )
}
