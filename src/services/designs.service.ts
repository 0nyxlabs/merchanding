import { api } from './api'
import type { Design, CreateDesignDto } from '@/types'

export const designsService = {
  getUserDesigns: async (): Promise<Design[]> => {
    const { data } = await api.get('/designs')
    return data
  },

  getDesignById: async (designId: string): Promise<Design> => {
    const { data } = await api.get(`/designs/${designId}`)
    return data
  },

  createDesign: async (dto: CreateDesignDto): Promise<Design> => {
    const { data } = await api.post('/designs', dto)
    return data
  },

  deleteDesign: async (designId: string): Promise<void> => {
    await api.delete(`/designs/${designId}`)
  },
}
