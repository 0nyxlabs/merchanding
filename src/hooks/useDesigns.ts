import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { designsService } from '@/services/designs.service'
import { uploadService } from '@/services/upload.service'
import { useAuthStore } from '@/store/authStore'
import { QUERY_KEYS } from '@/utils/constants'
import { toast } from 'react-hot-toast'

export const useDesigns = () => {
  const { data: designs, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.DESIGNS],
    queryFn: designsService.getUserDesigns,
  })

  return { designs, isLoading }
}

export const useCreateDesign = () => {
  const queryClient = useQueryClient()
  const user = useAuthStore((s) => s.user)

  return useMutation({
    mutationFn: async ({ file, name, description }: { file: File; name: string; description?: string }) => {
      if (!user) throw new Error('Not authenticated')

      const imageUrl = await uploadService.uploadDesign(file, user.id)
      return designsService.createDesign({ name, description, imageUrl })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DESIGNS] })
      toast.success('Design uploaded successfully!')
    },
    onError: () => {
      toast.error('Failed to upload design')
    },
  })
}

export const useDeleteDesign = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: designsService.deleteDesign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DESIGNS] })
      toast.success('Design deleted')
    },
    onError: () => {
      toast.error('Failed to delete design')
    },
  })
}
