import { type FC, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ORDER_STATUS } from '@/utils/constants'
import type { OrderStatus, UpdateOrderStatusDto } from '@/types'
import { Loader2 } from 'lucide-react'

interface StatusUpdateFormProps {
  currentStatus: OrderStatus
  onSubmit: (dto: UpdateOrderStatusDto) => void
  isPending: boolean
}

const statusOptions = [
  { value: ORDER_STATUS.PENDING, label: 'Pending' },
  { value: ORDER_STATUS.CONFIRMED, label: 'Confirmed' },
  { value: ORDER_STATUS.PROCESSING, label: 'Processing' },
  { value: ORDER_STATUS.SHIPPED, label: 'Shipped' },
  { value: ORDER_STATUS.DELIVERED, label: 'Delivered' },
  { value: ORDER_STATUS.CANCELLED, label: 'Cancelled' },
]

export const StatusUpdateForm: FC<StatusUpdateFormProps> = ({
  currentStatus,
  onSubmit,
  isPending,
}) => {
  const [status, setStatus] = useState<OrderStatus>(currentStatus)
  const [description, setDescription] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ status, description: description || undefined })
  }

  const hasChanged = status !== currentStatus

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="status">New Status</Label>
        <Select value={status} onValueChange={(v) => setStatus(v as OrderStatus)}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Note (optional)</Label>
        <Textarea
          id="description"
          placeholder="Add a note about this status change..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>

      <Button type="submit" disabled={!hasChanged || isPending} className="w-full">
        {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
        Update Status
      </Button>
    </form>
  )
}
