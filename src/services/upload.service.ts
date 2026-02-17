import { supabase } from './supabase'

export const uploadService = {
  uploadDesign: async (file: File, userId: string): Promise<string> => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}/${Date.now()}.${fileExt}`
    const filePath = `designs/${fileName}`

    const { data, error } = await supabase.storage
      .from('designs')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) throw error

    const {
      data: { publicUrl },
    } = supabase.storage.from('designs').getPublicUrl(data.path)

    return publicUrl
  },

  deleteDesign: async (filePath: string): Promise<void> => {
    const { error } = await supabase.storage.from('designs').remove([filePath])
    if (error) throw error
  },
}
