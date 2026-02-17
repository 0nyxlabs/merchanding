export type ProductSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL'

export interface ProductColor {
  name: string
  hex: string
}

export interface ProductVariant {
  id: string
  size: ProductSize
  color: ProductColor
  sku: string
  price: number
  stock: number
}

export interface Product {
  id: string
  name: string
  description: string
  campaignId: string
  designId: string
  basePrice: number
  images: string[]
  variants: ProductVariant[]
  createdAt: string
  updatedAt: string
}

export interface ProductSummary {
  id: string
  name: string
  basePrice: number
  imageUrl: string
  campaignId: string
}

export interface CreateProductDto {
  name: string
  description: string
  campaignId: string
  designId: string
  basePrice: number
  images: string[]
  variants: Omit<ProductVariant, 'id'>[]
}
