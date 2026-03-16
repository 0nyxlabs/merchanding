import { api } from './api'
import type { Vote, CastVoteDto } from '@/types'

export const votesService = {
  // --- votes table ---

  castVote: async (dto: CastVoteDto): Promise<Vote> => {
    console.log(`[VOTES SERVICE] castVote — designId: ${dto.designId}, campaignId: ${dto.campaignId}`)
    const { data } = await api.post('/votes', dto)
    console.log(`[VOTES SERVICE] castVote ✅ Voto registrado — id: ${(data as Vote)?.id}`)
    return data as Vote
  },

  removeVote: async (designId: string): Promise<void> => {
    console.log(`[VOTES SERVICE] removeVote — designId: ${designId}`)
    await api.delete(`/votes/${designId}`)
    console.log(`[VOTES SERVICE] removeVote ✅ Voto eliminado`)
  },

  getUserVoteForDesign: async (designId: string): Promise<Vote | null> => {
    console.log(`[VOTES SERVICE] getUserVoteForDesign — designId: ${designId}`)
    const { data } = await api.get(`/votes/design/${designId}/me`)
    console.log(`[VOTES SERVICE] getUserVoteForDesign ✅ Voto: ${(data as Vote)?.id ? 'encontrado' : 'no existe'}`)
    return (data as Vote | null) ?? null
  },
}
