import { useState, useCallback } from 'react'
import type { FC } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { useCreateDesign } from '@/hooks/useDesigns'
import { toast } from 'react-hot-toast'

const PRODUCT_TYPES = [
  { value: 't-shirt', label: 'T-Shirt' },
  { value: 'hoodie', label: 'Hoodie' },
  { value: 'cap', label: 'Cap' },
  { value: 'mug', label: 'Mug' },
  { value: 'tote-bag', label: 'Tote Bag' },
  { value: 'poster', label: 'Poster' },
]

interface DesignUploaderProps {
  campaignId: string
  onSuccess?: () => void
}

export const DesignUploader: FC<DesignUploaderProps> = ({ campaignId, onSuccess }) => {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [targetProducts, setTargetProducts] = useState<string[]>([])

  const createDesign = useCreateDesign()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selected = acceptedFiles[0]
    if (!selected) return

    setFile(selected)
    setPreview(URL.createObjectURL(selected))
    if (!title) {
      setTitle(selected.name.replace(/\.[^/.]+$/, ''))
    }
  }, [title])

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
    setTitle('')
    setDescription('')
    setTargetProducts([])
  }

  const toggleProduct = (value: string) => {
    setTargetProducts((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !title.trim()) return
    if (targetProducts.length === 0) {
      toast.error('Select at least one product type')
      return
    }

    await createDesign.mutateAsync({
      file,
      campaignId,
      title: title.trim(),
      description: description.trim() || undefined,
      targetProducts,
    })
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

      {/* Title */}
      <div>
        <Label htmlFor="design-title">Design Title</Label>
        <Input
          id="design-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
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

      {/* Product types */}
      <div>
        <Label className="mb-2 block">Product Types</Label>
        <div className="grid grid-cols-2 gap-2">
          {PRODUCT_TYPES.map(({ value, label }) => (
            <label key={value} className="flex cursor-pointer items-center gap-2">
              <Checkbox
                checked={targetProducts.includes(value)}
                onCheckedChange={() => toggleProduct(value)}
              />
              <span className="text-sm">{label}</span>
            </label>
          ))}
        </div>
        {targetProducts.length === 0 && (
          <p className="mt-1 text-xs text-muted-foreground">Select at least one product type</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={!file || !title.trim() || targetProducts.length === 0 || createDesign.isPending}
      >
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
