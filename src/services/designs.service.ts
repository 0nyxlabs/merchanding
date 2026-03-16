import { api } from './api'
import type {
  Design,
  CreateDesignDto,
  SearchParams,
} from '@/types'

export const designsService = {
  // --- User designs ---

  getUserDesigns: async (): Promise<Design[]> => {
    console.log('[DESIGNS SERVICE] getUserDesigns — obteniendo diseños del usuario...')
    const { data } = await api.get('/designs')
    console.log(`[DESIGNS SERVICE] getUserDesigns ✅ ${Array.isArray(data) ? data.length : 0} diseños recibidos`)
    return data as Design[]
  },

  getDesignById: async (designId: string): Promise<Design> => {
    console.log(`[DESIGNS SERVICE] getDesignById — id: ${designId}`)
    const { data } = await api.get(`/designs/${designId}`)
    console.log(`[DESIGNS SERVICE] getDesignById ✅ Diseño: "${(data as Design)?.title}", status: ${(data as Design)?.status}`)
    return data as Design
  },

  // --- Designs by campaign ---

  getDesignsByCampaign: async (campaignId: string, params?: SearchParams & {
    moderationStatus?: string
  }): Promise<Design[]> => {
    console.log(`[DESIGNS SERVICE] getDesignsByCampaign — campaignId: ${campaignId}, params:`, JSON.stringify(params ?? {}))
    const { data } = await api.get(`/campaigns/${campaignId}/designs`, { params })
    console.log(`[DESIGNS SERVICE] getDesignsByCampaign ✅ ${Array.isArray(data) ? data.length : 0} diseños`)
    return data as Design[]
  },

  // --- CRUD ---

  createDesign: async (dto: CreateDesignDto): Promise<Design> => {
    console.log(`[DESIGNS SERVICE] createDesign — campaignId: ${dto.campaignId}, título: "${dto.title}"`)
    const { data } = await api.post('/designs', dto)
    console.log(`[DESIGNS SERVICE] createDesign ✅ Diseño creado — id: ${(data as Design)?.id}`)
    return data as Design
  },

  deleteDesign: async (designId: string): Promise<void> => {
    console.log(`[DESIGNS SERVICE] deleteDesign — id: ${designId}`)
    await api.delete(`/designs/${designId}`)
    console.log(`[DESIGNS SERVICE] deleteDesign ✅ Diseño eliminado — id: ${designId}`)
  },
}
