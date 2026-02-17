import type { FC } from 'react'
import { Link } from '@tanstack/react-router'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ImageWithFallback } from '@/components/shared/ImageWithFallback'
import type { CampaignSummary } from '@/types'

interface CampaignCardProps {
  campaign: CampaignSummary
}

const statusVariant: Record<string, 'default' | 'secondary' | 'outline'> = {
  active: 'default',
  draft: 'secondary',
  ended: 'outline',
}

export const CampaignCard: FC<CampaignCardProps> = ({ campaign }) => {
  return (
    <Link to="/campaigns/$campaignId" params={{ campaignId: campaign.id }}>
      <Card className="group overflow-hidden py-0 transition-shadow hover:shadow-md">
        <div className="aspect-[4/3] overflow-hidden">
          <ImageWithFallback
            src={campaign.imageUrl}
            alt={campaign.name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        </div>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold leading-tight">{campaign.name}</h3>
            <Badge variant={statusVariant[campaign.status] ?? 'outline'} className="shrink-0">
              {campaign.status}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {campaign.productCount} {campaign.productCount === 1 ? 'product' : 'products'}
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}
