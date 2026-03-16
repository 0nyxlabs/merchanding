import type { FC } from 'react'
import { MessageSquare } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { CommentItem } from './CommentItem'
import { CommentForm } from './CommentForm'
import { useDesignComments } from '@/hooks/useComments'
import { useAuth } from '@/hooks/useAuth'
import type { Comment } from '@/types'

interface CommentSectionProps {
  designId: string
}

export const CommentSection: FC<CommentSectionProps> = ({ designId }) => {
  const { data: comments, isLoading } = useDesignComments(designId)
  const { isAuthenticated } = useAuth()

  // Separate top-level comments from replies
  const topLevel = (comments ?? []).filter((c: Comment) => !c.parentId)
  const replies = (comments ?? []).filter((c: Comment) => !!c.parentId)
  const getReplies = (commentId: string) =>
    replies.filter((r: Comment) => r.parentId === commentId)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5" />
        <h3 className="font-semibold">
          Comments {comments ? `(${topLevel.length})` : ''}
        </h3>
      </div>

      {isAuthenticated && (
        <CommentForm designId={designId} />
      )}

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-1.5">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-8 w-full" />
            </div>
          ))}
        </div>
      ) : topLevel.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No comments yet. Be the first!
        </p>
      ) : (
        <div className="space-y-4">
          {topLevel.map((comment: Comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              designId={designId}
              replies={getReplies(comment.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
