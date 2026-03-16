import type { FC } from 'react'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUserVote, useCastVote, useRemoveVote } from '@/hooks/useVotes'
import { useAuth } from '@/hooks/useAuth'

interface VoteButtonProps {
  designId: string
  campaignId: string
  votesCount: number
}

export const VoteButton: FC<VoteButtonProps> = ({ designId, campaignId, votesCount }) => {
  const { isAuthenticated } = useAuth()
  const { data: voteData, isLoading } = useUserVote(designId)
  const castVote = useCastVote()
  const removeVote = useRemoveVote()

  const hasVoted = !!voteData?.data?.id || !!voteData?.id
  const isPending = castVote.isPending || removeVote.isPending

  const handleClick = () => {
    if (!isAuthenticated) return
    if (hasVoted) {
      removeVote.mutate(designId)
    } else {
      castVote.mutate({ designId, campaignId })
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-1 text-sm text-muted-foreground">
        <Heart className="h-4 w-4" />
        <span>{votesCount}</span>
      </div>
    )
  }

  return (
    <Button
      variant={hasVoted ? 'default' : 'outline'}
      size="sm"
      onClick={handleClick}
      disabled={isLoading || isPending}
      className="flex items-center gap-1.5"
    >
      <Heart className={`h-4 w-4 ${hasVoted ? 'fill-current' : ''}`} />
      <span>{votesCount}</span>
    </Button>
  )
}
