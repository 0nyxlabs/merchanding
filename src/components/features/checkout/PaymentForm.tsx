import { useState } from 'react'
import type { FC } from 'react'
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { formatCurrency } from '@/utils/formatters'

interface PaymentFormProps {
  total: number
  orderId: string
  onSuccess: () => void
}

export const PaymentForm: FC<PaymentFormProps> = ({ total, orderId, onSuccess }) => {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) return

    setIsProcessing(true)

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
      })

      if (error) {
        toast.error(error.message ?? 'Payment failed')
        return
      }

      if (paymentIntent?.status === 'succeeded') {
        toast.success('Payment successful!')
        onSuccess()
      }
    } catch {
      toast.error('An unexpected error occurred')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full"
        size="lg"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          `Pay ${formatCurrency(total)}`
        )}
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        Order #{orderId}
      </p>
    </form>
  )
}
