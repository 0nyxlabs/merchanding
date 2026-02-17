import type { FC } from 'react'
import { Trash2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ImageWithFallback } from '@/components/shared/ImageWithFallback'
import { formatDate } from '@/utils/formatters'
import type { Design } from '@/types'

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive'> = {
  approved: 'default',
  pending: 'secondary',
  rejected: 'destructive',
}

interface DesignCardProps {
  design: Design
  onPreview: (design: Design) => void
  onDelete: (designId: string) => void
}

export const DesignCard: FC<DesignCardProps> = ({ design, onPreview, onDelete }) => {
  return (
    <Card className="group overflow-hidden py-0">
      <div
        className="aspect-square cursor-pointer overflow-hidden"
        onClick={() => onPreview(design)}
      >
        <ImageWithFallback
          src={design.imageUrl}
          alt={design.name}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
      </div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h4 className="truncate font-medium">{design.name}</h4>
            <p className="text-xs text-muted-foreground">{formatDate(design.createdAt)}</p>
          </div>
          <Badge variant={statusVariant[design.status] ?? 'secondary'} className="shrink-0">
            {design.status}
          </Badge>
        </div>
        {design.rejectionReason && (
          <p className="mt-2 text-xs text-destructive">{design.rejectionReason}</p>
        )}
        <div className="mt-3 flex justify-end">
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => onDelete(design.id)}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
