import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { designsService } from '@/services/designs.service'
import { uploadService } from '@/services/upload.service'
import { useAuthStore } from '@/store/authStore'
import { QUERY_KEYS } from '@/utils/constants'
import { toast } from 'react-hot-toast'
import type { CreateDesignDto, Design, SearchParams } from '@/types'

// --- User's own designs ---

export const useDesigns = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.DESIGNS],
    queryFn: () => {
      console.log('[USE DESIGNS] useDesigns — ejecutando query...')
      return designsService.getUserDesigns()
    },
  })
}

// --- Single design ---

export const useDesign = (designId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.DESIGNS, designId],
    queryFn: () => {
      console.log(`[USE DESIGNS] useDesign — designId: ${designId}`)
      return designsService.getDesignById(designId)
    },
    enabled: !!designId,
  })
}

// --- Designs by campaign ---

export const useDesignsByCampaign = (campaignId: string, params?: SearchParams & { moderationStatus?: string }) => {
  return useQuery<Design[]>({
    queryKey: [QUERY_KEYS.DESIGNS, 'campaign', campaignId, params],
    queryFn: () => {
      console.log(`[USE DESIGNS] useDesignsByCampaign — campaignId: ${campaignId}`)
      return designsService.getDesignsByCampaign(campaignId, params)
    },
    enabled: !!campaignId,
  })
}

// --- Create design (upload file + create record) ---

export const useCreateDesign = () => {
  const queryClient = useQueryClient()
  const user = useAuthStore((s) => s.user)

  return useMutation({
    mutationFn: async ({
      file,
      campaignId,
      title,
      description,
      tags,
      targetProducts,
      suggestedColor,
    }: {
      file: File
      campaignId: string
      title: string
      description?: string
      tags?: string[]
      targetProducts: string[]
      suggestedColor?: string
    }) => {
      console.log(`[USE DESIGNS] useCreateDesign — título: "${title}", campaignId: ${campaignId}, archivo: ${file.name}, userId: ${user?.id}`)
      if (!user) {
        console.error('[USE DESIGNS] useCreateDesign ❌ Usuario no autenticado')
        throw new Error('Not authenticated')
      }

      console.log('[USE DESIGNS] useCreateDesign — [PASO 1] Subiendo imagen a Supabase Storage...')
      const originalFileUrl = await uploadService.uploadDesign(file, user.id)
      console.log(`[USE DESIGNS] useCreateDesign — [PASO 2] Imagen subida: ${originalFileUrl}`)

      const dto: CreateDesignDto = {
        campaignId,
        title,
        description,
        tags,
        originalFileUrl,
        targetProducts,
        suggestedColor,
        fileFormat: file.name.split('.').pop(),
        fileSize: file.size,
      }

      console.log('[USE DESIGNS] useCreateDesign — [PASO 3] Creando diseño en backend...')
      return designsService.createDesign(dto)
    },
    onSuccess: () => {
      console.log(`[USE DESIGNS] useCreateDesign ✅ Diseño creado — invalidando cache [${QUERY_KEYS.DESIGNS}]`)
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DESIGNS] })
      toast.success('Design uploaded successfully!')
    },
    onError: (error) => {
      console.error('[USE DESIGNS] useCreateDesign ❌ Error:', error)
      toast.error('Failed to upload design')
    },
  })
}

// --- Delete design ---

export const useDeleteDesign = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (designId: string) => {
      console.log(`[USE DESIGNS] useDeleteDesign — eliminando designId: ${designId}`)
      return designsService.deleteDesign(designId)
    },
    onSuccess: () => {
      console.log(`[USE DESIGNS] useDeleteDesign ✅ Diseño eliminado — invalidando cache [${QUERY_KEYS.DESIGNS}]`)
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DESIGNS] })
      toast.success('Design deleted')
    },
    onError: (error) => {
      console.error('[USE DESIGNS] useDeleteDesign ❌ Error:', error)
      toast.error('Failed to delete design')
    },
  })
}
