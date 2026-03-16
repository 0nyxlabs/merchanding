import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Separator } from '@/components/ui/separator'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DesignUploader } from '@/components/features/designs/DesignUploader'
import { DesignGallery } from '@/components/features/designs/DesignGallery'
import { useDesigns, useDeleteDesign } from '@/hooks/useDesigns'
import { useCampaigns } from '@/hooks/useCampaigns'

export const Route = createFileRoute('/_authenticated/designs')({
  component: DesignsPage,
})

const UPLOAD_STATUSES = ['open', 'voting']

function DesignsPage() {
  const { data: designs, isLoading } = useDesigns()
  const deleteDesign = useDeleteDesign()
  const { data: campaignsData } = useCampaigns()
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('')

  const activeCampaigns = (campaignsData ?? []).filter((c) =>
    UPLOAD_STATUSES.includes(c.status),
  )

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h2 className="text-3xl font-bold tracking-tight">My Designs</h2>
      <p className="mt-2 text-muted-foreground">Upload and manage your designs.</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Upload form */}
        <div>
          <h3 className="mb-4 text-lg font-semibold">Upload New Design</h3>

          {/* Campaign selector */}
          <div className="mb-4">
            <Label htmlFor="campaign-select" className="mb-1.5 block">
              Campaign
            </Label>
            {activeCampaigns.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No open campaigns available for submissions.
              </p>
            ) : (
              <Select value={selectedCampaignId} onValueChange={setSelectedCampaignId}>
                <SelectTrigger id="campaign-select">
                  <SelectValue placeholder="Select a campaign..." />
                </SelectTrigger>
                <SelectContent>
                  {activeCampaigns.map((campaign) => (
                    <SelectItem key={campaign.id} value={campaign.id}>
                      {campaign.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {selectedCampaignId ? (
            <DesignUploader
              campaignId={selectedCampaignId}
              onSuccess={() => setSelectedCampaignId('')}
            />
          ) : (
            <p className="text-sm text-muted-foreground">
              Select a campaign above to upload your design.
            </p>
          )}
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
