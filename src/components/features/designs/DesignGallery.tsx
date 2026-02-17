import { useState } from 'react'
import type { FC } from 'react'
import { Palette } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { DesignCard } from './DesignCard'
import { DesignPreview } from './DesignPreview'
import { EmptyState } from '@/components/shared/EmptyState'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import type { Design } from '@/types'

interface DesignGalleryProps {
  designs: Design[] | undefined
  isLoading: boolean
  onDelete: (designId: string) => void
}

export const DesignGallery: FC<DesignGalleryProps> = ({ designs, isLoading, onDelete }) => {
  const [previewDesign, setPreviewDesign] = useState<Design | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-square w-full rounded-xl" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  if (!designs?.length) {
    return (
      <EmptyState
        icon={<Palette className="h-12 w-12" />}
        title="No designs yet"
        description="Upload your first design to get started."
      />
    )
  }

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {designs.map((design) => (
          <DesignCard
            key={design.id}
            design={design}
            onPreview={setPreviewDesign}
            onDelete={(id) => setDeleteId(id)}
          />
        ))}
      </div>

      <DesignPreview
        design={previewDesign}
        open={!!previewDesign}
        onClose={() => setPreviewDesign(null)}
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => { if (!open) setDeleteId(null) }}
        title="Delete design"
        description="Are you sure you want to delete this design? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={() => {
          if (deleteId) onDelete(deleteId)
        }}
      />
    </>
  )
}
