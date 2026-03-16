import { supabase } from './supabase'

export const uploadService = {
  uploadDesign: async (file: File, userId: string): Promise<string> => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}/${Date.now()}.${fileExt}`
    const filePath = `designs/${fileName}`

    console.log('[UPLOAD SERVICE] uploadDesign — subiendo archivo a Supabase Storage...')
    console.log(`[UPLOAD SERVICE] uploadDesign — archivo: ${file.name}, tipo: ${file.type}, tamaño: ${(file.size / 1024).toFixed(2)} KB`)
    console.log(`[UPLOAD SERVICE] uploadDesign — destino: designs/${filePath}`)

    const { data, error } = await supabase.storage
      .from('designs')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) {
      console.error('[UPLOAD SERVICE] uploadDesign ❌ Error al subir archivo:', error.message)
      throw error
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('designs').getPublicUrl(data.path)

    console.log(`[UPLOAD SERVICE] uploadDesign ✅ Archivo subido — path: ${data.path}`)
    console.log(`[UPLOAD SERVICE] uploadDesign — publicUrl: ${publicUrl}`)
    return publicUrl
  },

  deleteDesign: async (filePath: string): Promise<void> => {
    console.log(`[UPLOAD SERVICE] deleteDesign — eliminando archivo: ${filePath}`)
    const { error } = await supabase.storage.from('designs').remove([filePath])
    if (error) {
      console.error('[UPLOAD SERVICE] deleteDesign ❌ Error:', error.message)
      throw error
    }
    console.log(`[UPLOAD SERVICE] deleteDesign ✅ Archivo eliminado: ${filePath}`)
  },
}
