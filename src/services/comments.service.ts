import { api } from './api'
import type { Comment, CommentVote, CreateCommentDto, UpdateCommentDto } from '@/types'

export const commentsService = {
  // --- comments table ---

  getDesignComments: async (designId: string): Promise<Comment[]> => {
    console.log(`[COMMENTS SERVICE] getDesignComments — designId: ${designId}`)
    const { data } = await api.get(`/comments/design/${designId}`)
    console.log(`[COMMENTS SERVICE] getDesignComments ✅ ${Array.isArray(data) ? data.length : 0} comentarios`)
    return data as Comment[]
  },

  createComment: async (dto: CreateCommentDto): Promise<Comment> => {
    console.log(`[COMMENTS SERVICE] createComment — designId: ${dto.designId}, parentId: ${dto.parentId ?? 'root'}`)
    const { data } = await api.post('/comments', dto)
    console.log(`[COMMENTS SERVICE] createComment ✅ Comentario creado — id: ${data?.data?.id ?? data?.id}`)
    return data
  },

  updateComment: async (commentId: string, dto: UpdateCommentDto): Promise<Comment> => {
    console.log(`[COMMENTS SERVICE] updateComment — commentId: ${commentId}`)
    const { data } = await api.patch(`/comments/${commentId}`, dto)
    console.log(`[COMMENTS SERVICE] updateComment ✅ Comentario actualizado`)
    return data
  },

  deleteComment: async (commentId: string): Promise<void> => {
    console.log(`[COMMENTS SERVICE] deleteComment — commentId: ${commentId}`)
    await api.delete(`/comments/${commentId}`)
    console.log(`[COMMENTS SERVICE] deleteComment ✅ Comentario eliminado`)
  },

  // --- comment_votes table ---

  upvoteComment: async (commentId: string): Promise<CommentVote> => {
    console.log(`[COMMENTS SERVICE] upvoteComment — commentId: ${commentId}`)
    const { data } = await api.post(`/comments/${commentId}/upvote`)
    console.log(`[COMMENTS SERVICE] upvoteComment ✅ Upvote registrado`)
    return data
  },

  removeUpvote: async (commentId: string): Promise<void> => {
    console.log(`[COMMENTS SERVICE] removeUpvote — commentId: ${commentId}`)
    await api.delete(`/comments/${commentId}/upvote`)
    console.log(`[COMMENTS SERVICE] removeUpvote ✅ Upvote eliminado`)
  },
}
