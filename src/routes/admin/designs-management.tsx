import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DesignApprovalCard } from '@/components/features/admin/DesignApprovalCard'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/shared/EmptyState'
import { useAdminDesigns, useReviewDesign } from '@/hooks/useAdmin'
import { DESIGN_STATUS } from '@/utils/constants'
import { useDebounce } from '@/hooks/useDebounce'
import { Search, Palette } from 'lucide-react'

export const Route = createFileRoute('/admin/designs-management')({
  component: DesignsManagementPage,
})

function DesignsManagementPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const debouncedSearch = useDebounce(search, 300)

  const { data: designs, isLoading } = useAdminDesigns({
    search: debouncedSearch || undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
  })

  const reviewDesign = useReviewDesign()

  const handleApprove = (designId: string) => {
    reviewDesign.mutate({ designId, dto: { status: 'approved' } })
  }

  const handleReject = (designId: string, reason: string) => {
    reviewDesign.mutate({
      designId,
      dto: { status: 'rejected', rejectionReason: reason },
    })
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Designs Management</h2>
        <p className="mt-1 text-muted-foreground">
          Review and approve submitted designs.
        </p>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search designs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value={DESIGN_STATUS.PENDING}>Pending</SelectItem>
            <SelectItem value={DESIGN_STATUS.APPROVED}>Approved</SelectItem>
            <SelectItem value={DESIGN_STATUS.REJECTED}>Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-80 w-full rounded-lg" />
          ))}
        </div>
      ) : !designs?.length ? (
        <EmptyState
          icon={<Palette className="h-12 w-12" />}
          title="No designs found"
          description="No designs match the current filters."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {designs.map((design) => (
            <DesignApprovalCard
              key={design.id}
              design={design}
              onApprove={handleApprove}
              onReject={handleReject}
              isPending={reviewDesign.isPending}
            />
          ))}
        </div>
      )}
    </div>
  )
}
