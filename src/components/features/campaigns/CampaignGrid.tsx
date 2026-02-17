import type { FC } from 'react'
import { CampaignCard } from './CampaignCard'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/shared/EmptyState'
import { Package } from 'lucide-react'
import type { CampaignSummary } from '@/types'

interface CampaignGridProps {
  campaigns: CampaignSummary[] | undefined
  isLoading: boolean
}

export const CampaignGrid: FC<CampaignGridProps> = ({ campaigns, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-[4/3] w-full rounded-xl" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  if (!campaigns?.length) {
    return (
      <EmptyState
        icon={<Package className="h-12 w-12" />}
        title="No campaigns found"
        description="There are no campaigns matching your criteria."
      />
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {campaigns.map((campaign) => (
        <CampaignCard key={campaign.id} campaign={campaign} />
      ))}
    </div>
  )
}
