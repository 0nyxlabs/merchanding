import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/shared/EmptyState'
import { ImageWithFallback } from '@/components/shared/ImageWithFallback'
import { useAdminCampaigns } from '@/hooks/useAdmin'
import { adminService } from '@/services/admin.service'
import { formatDate } from '@/utils/formatters'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/utils/constants'
import { toast } from 'react-hot-toast'
import type { Campaign, CreateCampaignDto, UpdateCampaignDto } from '@/types'
import { Plus, Pencil, Trash2, Megaphone, Loader2 } from 'lucide-react'

export const Route = createFileRoute('/admin/campaigns-management')({
  component: CampaignsManagementPage,
})

function CampaignsManagementPage() {
  const { data: campaigns, isLoading } = useAdminCampaigns()
  const queryClient = useQueryClient()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  // Form state
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const resetForm = () => {
    setName('')
    setDescription('')
    setImageUrl('')
    setStartDate('')
    setEndDate('')
    setEditingCampaign(null)
  }

  const openCreate = () => {
    resetForm()
    setDialogOpen(true)
  }

  const openEdit = (campaign: Campaign) => {
    setEditingCampaign(campaign)
    setName(campaign.name)
    setDescription(campaign.description)
    setImageUrl(campaign.imageUrl)
    setStartDate(campaign.startDate.split('T')[0])
    setEndDate(campaign.endDate.split('T')[0])
    setDialogOpen(true)
  }

  const createMutation = useMutation({
    mutationFn: (dto: CreateCampaignDto) => adminService.createCampaign(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', QUERY_KEYS.CAMPAIGNS] })
      toast.success('Campaign created')
      setDialogOpen(false)
      resetForm()
    },
    onError: () => toast.error('Failed to create campaign'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateCampaignDto }) =>
      adminService.updateCampaign(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', QUERY_KEYS.CAMPAIGNS] })
      toast.success('Campaign updated')
      setDialogOpen(false)
      resetForm()
    },
    onError: () => toast.error('Failed to update campaign'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminService.deleteCampaign(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', QUERY_KEYS.CAMPAIGNS] })
      toast.success('Campaign deleted')
      setDeleteConfirm(null)
    },
    onError: () => toast.error('Failed to delete campaign'),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const dto = { name, description, imageUrl, startDate, endDate }

    if (editingCampaign) {
      updateMutation.mutate({ id: editingCampaign.id, dto })
    } else {
      createMutation.mutate(dto)
    }
  }

  const isSaving = createMutation.isPending || updateMutation.isPending

  const statusVariant = (status: string) =>
    status === 'active' ? 'default' : status === 'ended' ? 'secondary' : 'outline'

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Campaigns Management</h2>
          <p className="mt-1 text-muted-foreground">
            Create and manage merchandising campaigns.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" />
          New Campaign
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : !campaigns?.length ? (
            <EmptyState
              icon={<Megaphone className="h-12 w-12" />}
              title="No campaigns yet"
              description="Create your first campaign to get started."
              action={
                <Button onClick={openCreate}>
                  <Plus className="h-4 w-4" />
                  New Campaign
                </Button>
              }
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Start</TableHead>
                  <TableHead>End</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead className="w-[100px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded">
                          <ImageWithFallback
                            src={campaign.imageUrl}
                            alt={campaign.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <span className="font-medium">{campaign.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariant(campaign.status)} className="capitalize">
                        {campaign.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(campaign.startDate)}</TableCell>
                    <TableCell>{formatDate(campaign.endDate)}</TableCell>
                    <TableCell>{campaign.productCount}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEdit(campaign)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteConfirm(campaign.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            resetForm()
          }
          setDialogOpen(open)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCampaign ? 'Edit Campaign' : 'New Campaign'}
            </DialogTitle>
            <DialogDescription>
              {editingCampaign
                ? 'Update the campaign details.'
                : 'Fill in the details for the new campaign.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isSaving}>
                {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                {editingCampaign ? 'Save Changes' : 'Create Campaign'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteConfirm}
        onOpenChange={(open) => {
          if (!open) setDeleteConfirm(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Campaign</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this campaign? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() => deleteConfirm && deleteMutation.mutate(deleteConfirm)}
            >
              {deleteMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
