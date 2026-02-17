import { useState } from 'react'
import type { FC } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Elements } from '@stripe/react-stripe-js'
import { stripePromise } from '@/config/stripe.config'
import { ShippingForm } from './ShippingForm'
import { PaymentForm } from './PaymentForm'
import { OrderSummary } from './OrderSummary'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { useCart } from '@/hooks/useCart'
import { paymentsService } from '@/services/payments.service'
import { toast } from 'react-hot-toast'
import type { ShippingAddress } from '@/types'

type CheckoutStep = 'shipping' | 'payment'

export const CheckoutForm: FC = () => {
  const navigate = useNavigate()
  const { items, calculateTotals, clearCart } = useCart()
  const totals = calculateTotals()

  const [step, setStep] = useState<CheckoutStep>('shipping')
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [isCreatingIntent, setIsCreatingIntent] = useState(false)

  const handleShippingSubmit = async (address: ShippingAddress) => {
    setShippingAddress(address)
    setIsCreatingIntent(true)

    try {
      const { clientSecret: secret, orderId: id } =
        await paymentsService.createPaymentIntent({
          items,
          total: totals.total,
          shippingAddress: address,
        })

      setClientSecret(secret)
      setOrderId(id)
      setStep('payment')
    } catch {
      toast.error('Failed to create payment. Please try again.')
    } finally {
      setIsCreatingIntent(false)
    }
  }

  const handlePaymentSuccess = () => {
    clearCart()
    if (orderId) {
      navigate({ to: '/orders/$orderId/success', params: { orderId } })
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      {/* Form section */}
      <div className="lg:col-span-3">
        {/* Step indicators */}
        <div className="mb-6 flex gap-4">
          <StepIndicator
            number={1}
            label="Shipping"
            active={step === 'shipping'}
            completed={step === 'payment'}
          />
          <StepIndicator
            number={2}
            label="Payment"
            active={step === 'payment'}
            completed={false}
          />
        </div>

        {isCreatingIntent ? (
          <LoadingSpinner text="Setting up payment..." className="py-12" />
        ) : step === 'shipping' ? (
          <ShippingForm
            onSubmit={handleShippingSubmit}
            defaultValues={shippingAddress ?? undefined}
          />
        ) : clientSecret && orderId ? (
          <Elements
            stripe={stripePromise}
            options={{ clientSecret, appearance: { theme: 'stripe' } }}
          >
            <PaymentForm
              total={totals.total}
              orderId={orderId}
              onSuccess={handlePaymentSuccess}
            />
          </Elements>
        ) : null}
      </div>

      {/* Order summary sidebar */}
      <div className="lg:col-span-2">
        <OrderSummary items={items} totals={totals} />
      </div>
    </div>
  )
}

function StepIndicator({
  number,
  label,
  active,
  completed,
}: {
  number: number
  label: string
  active: boolean
  completed: boolean
}) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
          active
            ? 'bg-primary text-primary-foreground'
            : completed
              ? 'bg-primary/20 text-primary'
              : 'bg-muted text-muted-foreground'
        }`}
      >
        {completed ? '\u2713' : number}
      </div>
      <span
        className={`text-sm font-medium ${
          active ? 'text-foreground' : 'text-muted-foreground'
        }`}
      >
        {label}
      </span>
    </div>
  )
}
