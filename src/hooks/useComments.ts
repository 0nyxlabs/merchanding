import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { commentsService } from '@/services/comments.service'
import { QUERY_KEYS } from '@/utils/constants'
import { toast } from 'react-hot-toast'
import type { CreateCommentDto, UpdateCommentDto } from '@/types'

// --- Comments for a design ---

export const useDesignComments = (designId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.COMMENTS, 'design', designId],
    queryFn: () => {
      console.log(`[USE COMMENTS] useDesignComments — designId: ${designId}`)
      return commentsService.getDesignComments(designId)
    },
    enabled: !!designId,
  })
}

// --- Create comment ---

export const useCreateComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (dto: CreateCommentDto) => {
      console.log(`[USE COMMENTS] useCreateComment — designId: ${dto.designId}`)
      return commentsService.createComment(dto)
    },
    onSuccess: (_, dto) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COMMENTS, 'design', dto.designId] })
      toast.success('Comment posted')
    },
    onError: () => {
      toast.error('Failed to post comment')
    },
  })
}

// --- Update comment ---

export const useUpdateComment = (designId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ commentId, dto }: { commentId: string; dto: UpdateCommentDto }) =>
      commentsService.updateComment(commentId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COMMENTS, 'design', designId] })
      toast.success('Comment updated')
    },
    onError: () => {
      toast.error('Failed to update comment')
    },
  })
}

// --- Delete comment ---

export const useDeleteComment = (designId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (commentId: string) => commentsService.deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COMMENTS, 'design', designId] })
      toast.success('Comment deleted')
    },
    onError: () => {
      toast.error('Failed to delete comment')
    },
  })
}

// --- Upvote comment ---

export const useUpvoteComment = (designId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (commentId: string) => commentsService.upvoteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COMMENTS, 'design', designId] })
    },
    onError: () => {
      toast.error('Failed to upvote comment')
    },
  })
}
