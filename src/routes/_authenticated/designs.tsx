import { createFileRoute } from '@tanstack/react-router'
import { Separator } from '@/components/ui/separator'
import { DesignUploader } from '@/components/features/designs/DesignUploader'
import { DesignGallery } from '@/components/features/designs/DesignGallery'
import { useDesigns, useDeleteDesign } from '@/hooks/useDesigns'

export const Route = createFileRoute('/_authenticated/designs')({
  component: DesignsPage,
})

function DesignsPage() {
  const { designs, isLoading } = useDesigns()
  const deleteDesign = useDeleteDesign()

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h2 className="text-3xl font-bold tracking-tight">My Designs</h2>
      <p className="mt-2 text-muted-foreground">
        Upload and manage your designs.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Upload form */}
        <div>
          <h3 className="mb-4 text-lg font-semibold">Upload New Design</h3>
          <DesignUploader />
        </div>

        {/* Gallery */}
        <div className="lg:col-span-2">
          <h3 className="mb-4 text-lg font-semibold">Your Designs</h3>
          <Separator className="mb-6" />
          <DesignGallery
            designs={designs}
            isLoading={isLoading}
            onDelete={(id) => deleteDesign.mutate(id)}
          />
        </div>
      </div>
    </div>
  )
}
