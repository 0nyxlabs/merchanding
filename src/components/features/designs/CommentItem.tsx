import { useState, type FC } from 'react'
import { ThumbsUp, Reply, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CommentForm } from './CommentForm'
import { useUpvoteComment, useDeleteComment } from '@/hooks/useComments'
import { useAuth } from '@/hooks/useAuth'
import { useAuthStore } from '@/store/authStore'
import { formatDate } from '@/utils/formatters'
import type { Comment } from '@/types'

interface CommentItemProps {
  comment: Comment
  designId: string
  replies?: Comment[]
}

export const CommentItem: FC<CommentItemProps> = ({ comment, designId, replies = [] }) => {
  const [showReplyForm, setShowReplyForm] = useState(false)
  const { isAuthenticated } = useAuth()
  const user = useAuthStore((s) => s.user)
  const upvote = useUpvoteComment(designId)
  const deleteComment = useDeleteComment(designId)

  if (comment.isDeleted) {
    return (
      <div className="py-2 text-sm text-muted-foreground italic">[deleted]</div>
    )
  }

  const isOwner = user?.id === comment.userId

  return (
    <div className="space-y-2">
      <div className="flex gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium">User</span>
            <span className="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</span>
          </div>
          <p className="mt-1 text-sm">{comment.content}</p>
          <div className="mt-1.5 flex items-center gap-2">
            {isAuthenticated && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs text-muted-foreground"
                  onClick={() => upvote.mutate(comment.id)}
                  disabled={upvote.isPending}
                >
                  <ThumbsUp className="mr-1 h-3 w-3" />
                  {comment.upvotes}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs text-muted-foreground"
                  onClick={() => setShowReplyForm((v) => !v)}
                >
                  <Reply className="mr-1 h-3 w-3" />
                  Reply
                </Button>
              </>
            )}
            {!isAuthenticated && comment.upvotes > 0 && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <ThumbsUp className="h-3 w-3" />
                {comment.upvotes}
              </span>
            )}
            {isOwner && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive"
                onClick={() => deleteComment.mutate(comment.id)}
                disabled={deleteComment.isPending}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {showReplyForm && (
        <div className="ml-6">
          <CommentForm
            designId={designId}
            parentId={comment.id}
            onCancel={() => setShowReplyForm(false)}
            placeholder="Write a reply..."
          />
        </div>
      )}

      {replies.length > 0 && (
        <div className="ml-6 space-y-3 border-l pl-4">
          {replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} designId={designId} />
          ))}
        </div>
      )}
    </div>
  )
}
