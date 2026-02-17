import { createFileRoute, Link } from '@tanstack/react-router'
import { CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/_authenticated/orders/$orderId/success')({
  component: OrderSuccessPage,
})

function OrderSuccessPage() {
  const { orderId } = Route.useParams()

  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center sm:px-6">
      <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
      <h2 className="mt-6 text-3xl font-bold tracking-tight">Order Confirmed!</h2>
      <p className="mt-3 text-muted-foreground">
        Thank you for your purchase. Your order has been placed successfully.
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        Order ID: <span className="font-mono font-medium text-foreground">{orderId}</span>
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button asChild>
          <Link to="/orders/$orderId" params={{ orderId }}>
            View Order Details
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/browse">Continue Shopping</Link>
        </Button>
      </div>
    </div>
  )
}
