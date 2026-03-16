import { useState, type FC } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useCreateComment } from '@/hooks/useComments'

interface CommentFormProps {
  designId: string
  parentId?: string | null
  onCancel?: () => void
  placeholder?: string
}

export const CommentForm: FC<CommentFormProps> = ({
  designId,
  parentId,
  onCancel,
  placeholder = 'Write a comment...',
}) => {
  const [content, setContent] = useState('')
  const createComment = useCreateComment()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return
    createComment.mutate(
      { designId, content: content.trim(), parentId: parentId ?? undefined },
      { onSuccess: () => setContent('') },
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="resize-none text-sm"
      />
      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          size="sm"
          disabled={!content.trim() || createComment.isPending}
        >
          {createComment.isPending ? 'Posting...' : 'Post'}
        </Button>
      </div>
    </form>
  )
}
