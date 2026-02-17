import type { FC } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { ImageWithFallback } from '@/components/shared/ImageWithFallback'
import { formatDate } from '@/utils/formatters'
import type { Design } from '@/types'

interface DesignPreviewProps {
  design: Design | null
  open: boolean
  onClose: () => void
}

export const DesignPreview: FC<DesignPreviewProps> = ({ design, open, onClose }) => {
  if (!design) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{design.name}</DialogTitle>
          <DialogDescription>
            Uploaded on {formatDate(design.createdAt)}
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-hidden rounded-lg">
          <ImageWithFallback
            src={design.imageUrl}
            alt={design.name}
            className="w-full object-contain"
          />
        </div>
        <div className="flex items-center gap-2">
          <Badge>{design.status}</Badge>
          {design.description && (
            <p className="text-sm text-muted-foreground">{design.description}</p>
          )}
        </div>
        {design.rejectionReason && (
          <p className="text-sm text-destructive">
            Rejection reason: {design.rejectionReason}
          </p>
        )}
      </DialogContent>
    </Dialog>
  )
}
