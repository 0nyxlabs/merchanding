import { useState, type FC } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useRequestPayout } from '@/hooks/useEarnings'
import { PAYOUT_METHOD } from '@/utils/constants'
import { formatCurrency } from '@/utils/formatters'

interface RequestPayoutFormProps {
  availableBalance: number
}

export const RequestPayoutForm: FC<RequestPayoutFormProps> = ({ availableBalance }) => {
  const [amount, setAmount] = useState('')
  const [method, setMethod] = useState<string>('')
  const [paypalEmail, setPaypalEmail] = useState('')
  const requestPayout = useRequestPayout()

  const MIN_PAYOUT = 10
  const parsedAmount = parseFloat(amount)
  const isValid =
    method &&
    !isNaN(parsedAmount) &&
    parsedAmount >= MIN_PAYOUT &&
    parsedAmount <= availableBalance &&
    (method !== PAYOUT_METHOD.PAYPAL || paypalEmail.trim() !== '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return

    const payoutDetails: Record<string, unknown> =
      method === PAYOUT_METHOD.PAYPAL ? { email: paypalEmail } : {}

    requestPayout.mutate({
      amount: parsedAmount,
      method: method as typeof PAYOUT_METHOD[keyof typeof PAYOUT_METHOD],
      payoutDetails,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-md bg-muted/50 px-4 py-3 text-sm">
        Available: <span className="font-semibold text-green-600">{formatCurrency(availableBalance)}</span>
        {availableBalance < MIN_PAYOUT && (
          <span className="ml-2 text-muted-foreground">(minimum {formatCurrency(MIN_PAYOUT)} required)</span>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="payout-amount">Amount</Label>
        <Input
          id="payout-amount"
          type="number"
          min={MIN_PAYOUT}
          max={availableBalance}
          step="0.01"
          placeholder={`Min ${formatCurrency(MIN_PAYOUT)}`}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <Label>Payout Method</Label>
        <Select value={method} onValueChange={setMethod}>
          <SelectTrigger>
            <SelectValue placeholder="Select method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={PAYOUT_METHOD.PAYPAL}>PayPal</SelectItem>
            <SelectItem value={PAYOUT_METHOD.STRIPE}>Stripe</SelectItem>
            <SelectItem value={PAYOUT_METHOD.BANK_TRANSFER}>Bank Transfer</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {method === PAYOUT_METHOD.PAYPAL && (
        <div className="space-y-1.5">
          <Label htmlFor="paypal-email">PayPal Email</Label>
          <Input
            id="paypal-email"
            type="email"
            placeholder="your@email.com"
            value={paypalEmail}
            onChange={(e) => setPaypalEmail(e.target.value)}
          />
        </div>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={!isValid || requestPayout.isPending || availableBalance < MIN_PAYOUT}
      >
        {requestPayout.isPending ? 'Requesting...' : 'Request Payout'}
      </Button>
    </form>
  )
}
