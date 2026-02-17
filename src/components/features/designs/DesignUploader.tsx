import { useState, useCallback } from 'react'
import type { FC } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useCreateDesign } from '@/hooks/useDesigns'
import { toast } from 'react-hot-toast'

interface DesignUploaderProps {
  onSuccess?: () => void
}

export const DesignUploader: FC<DesignUploaderProps> = ({ onSuccess }) => {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const createDesign = useCreateDesign()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selected = acceptedFiles[0]
    if (!selected) return

    setFile(selected)
    setPreview(URL.createObjectURL(selected))
    if (!name) {
      setName(selected.name.replace(/\.[^/.]+$/, ''))
    }
  }, [name])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.svg'] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
    onDropRejected: () => {
      toast.error('File must be an image under 10MB')
    },
  })

  const handleClear = () => {
    setFile(null)
    if (preview) URL.revokeObjectURL(preview)
    setPreview(null)
    setName('')
    setDescription('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !name.trim()) return

    await createDesign.mutateAsync({ file, name: name.trim(), description: description.trim() || undefined })
    handleClear()
    onSuccess?.()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Dropzone */}
      {!preview ? (
        <div
          {...getRootProps()}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors ${
            isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="mb-3 h-8 w-8 text-muted-foreground" />
          <p className="text-sm font-medium">
            {isDragActive ? 'Drop your design here' : 'Drag & drop your design'}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            PNG, JPG, WebP, or SVG (max 10MB)
          </p>
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-xl border">
          <img src={preview} alt="Preview" className="h-48 w-full object-contain bg-muted" />
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-2 rounded-full bg-background/80 p-1.5 hover:bg-background"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Name */}
      <div>
        <Label htmlFor="design-name">Design Name</Label>
        <Input
          id="design-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="My awesome design"
          required
          className="mt-1"
        />
      </div>

      {/* Description */}
      <div>
        <Label htmlFor="design-desc">Description (optional)</Label>
        <Textarea
          id="design-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="A brief description of your design"
          rows={3}
          className="mt-1"
        />
      </div>

      <Button type="submit" className="w-full" disabled={!file || !name.trim() || createDesign.isPending}>
        {createDesign.isPending ? (
          <>
            <Loader2 className="mr-2 animate-spin" />
            Uploading...
          </>
        ) : (
          'Upload Design'
        )}
      </Button>
    </form>
  )
}
