import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { votesService } from '@/services/votes.service'
import { QUERY_KEYS } from '@/utils/constants'
import { toast } from 'react-hot-toast'
import type { CastVoteDto } from '@/types'

// --- User vote for a design ---

export const useUserVote = (designId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.VOTES, 'design', designId],
    queryFn: () => votesService.getUserVoteForDesign(designId),
    enabled: !!designId,
  })
}

// --- Cast vote ---

export const useCastVote = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (dto: CastVoteDto) => {
      console.log(`[USE VOTES] useCastVote — designId: ${dto.designId}, campaignId: ${dto.campaignId}`)
      return votesService.castVote(dto)
    },
    onSuccess: (_, dto) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.VOTES, 'design', dto.designId] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DESIGNS, 'campaign', dto.campaignId] })
      toast.success('Vote cast!')
    },
    onError: () => {
      toast.error('Failed to cast vote')
    },
  })
}

// --- Remove vote ---

export const useRemoveVote = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (designId: string) => {
      console.log(`[USE VOTES] useRemoveVote — designId: ${designId}`)
      return votesService.removeVote(designId)
    },
    onSuccess: (_, designId) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.VOTES, 'design', designId] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DESIGNS] })
      toast.success('Vote removed')
    },
    onError: () => {
      toast.error('Failed to remove vote')
    },
  })
}
