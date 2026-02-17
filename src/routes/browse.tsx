import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CampaignGrid } from '@/components/features/campaigns/CampaignGrid'
import { useCampaigns } from '@/hooks/useCampaigns'

export const Route = createFileRoute('/browse')({
  component: BrowsePage,
})

function BrowsePage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<string>('all')

  const { data, isLoading } = useCampaigns({
    search: search || undefined,
    status: status === 'all' ? undefined : status,
  })

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Browse Campaigns</h2>
        <p className="mt-2 text-muted-foreground">
          Explore our collection of custom-designed merchandise.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search campaigns..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Campaigns</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="ended">Ended</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Campaign grid */}
      <CampaignGrid campaigns={data?.data} isLoading={isLoading} />
    </div>
  )
}
