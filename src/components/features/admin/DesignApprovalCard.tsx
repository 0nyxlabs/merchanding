import { type FC, useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { ImageWithFallback } from '@/components/shared/ImageWithFallback'
import { formatRelativeDate } from '@/utils/formatters'
import type { Design } from '@/types'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

interface DesignApprovalCardProps {
  design: Design
  onApprove: (designId: string) => void
  onReject: (designId: string, reason: string) => void
  isPending: boolean
}

export const DesignApprovalCard: FC<DesignApprovalCardProps> = ({
  design,
  onApprove,
  onReject,
  isPending,
}) => {
  const [showRejectForm, setShowRejectForm] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')

  const handleReject = () => {
    if (!rejectionReason.trim()) return
    onReject(design.id, rejectionReason)
  }

  const statusVariant =
    design.status === 'approved'
      ? 'default'
      : design.status === 'rejected'
        ? 'destructive'
        : 'secondary'

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base">{design.name}</CardTitle>
          <Badge variant={statusVariant} className="capitalize">
            {design.status}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          Submitted {formatRelativeDate(design.createdAt)}
        </p>
      </CardHeader>
      <CardContent>
        <div className="aspect-square overflow-hidden rounded-lg">
          <ImageWithFallback
            src={design.imageUrl}
            alt={design.name}
            className="h-full w-full object-cover"
          />
        </div>
        {design.description && (
          <p className="mt-2 text-sm text-muted-foreground">{design.description}</p>
        )}
        {design.rejectionReason && (
          <p className="mt-2 text-sm text-destructive">
            Rejection reason: {design.rejectionReason}
          </p>
        )}

        {showRejectForm && (
          <div className="mt-3 space-y-2">
            <Textarea
              placeholder="Reason for rejection..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={2}
            />
            <div className="flex gap-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleReject}
                disabled={!rejectionReason.trim() || isPending}
              >
                {isPending && <Loader2 className="h-3 w-3 animate-spin" />}
                Confirm Reject
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowRejectForm(false)
                  setRejectionReason('')
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>

      {design.status === 'pending' && !showRejectForm && (
        <CardFooter className="gap-2">
          <Button
            size="sm"
            onClick={() => onApprove(design.id)}
            disabled={isPending}
            className="flex-1"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle className="h-4 w-4" />
            )}
            Approve
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowRejectForm(true)}
            disabled={isPending}
            className="flex-1"
          >
            <XCircle className="h-4 w-4" />
            Reject
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
