import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string              // campaign_products.id
  campaignId: string
  designId: string
  designTitle: string
  productType: string
  size: string
  color?: string
  price: number           // retail_price
  quantity: number
  thumbnailUrl?: string
}

interface CartStore {
  items: CartItem[]
  couponCode: string | null
  discount: number
  addItem: (item: CartItem) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
  setCoupon: (code: string, discount: number) => void
  clearCoupon: () => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: null,
      discount: 0,

      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id)
          if (existingItem) {
            console.log(`[CART STORE] addItem — incrementando cantidad de "${item.designTitle}" (${existingItem.quantity} → ${existingItem.quantity + 1})`)
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
              ),
            }
          }
          console.log(`[CART STORE] addItem — añadiendo nuevo item: "${item.designTitle}", precio: $${item.price}`)
          return { items: [...state.items, { ...item, quantity: 1 }] }
        }),

      removeItem: (itemId) =>
        set((state) => {
          const item = state.items.find((i) => i.id === itemId)
          console.log(`[CART STORE] removeItem — eliminando "${item?.designTitle ?? itemId}"`)
          return { items: state.items.filter((i) => i.id !== itemId) }
        }),

      updateQuantity: (itemId, quantity) =>
        set((state) => {
          const item = state.items.find((i) => i.id === itemId)
          console.log(`[CART STORE] updateQuantity — "${item?.designTitle ?? itemId}" cantidad: ${item?.quantity} → ${quantity}`)
          return {
            items: state.items.map((i) =>
              i.id === itemId ? { ...i, quantity } : i,
            ),
          }
        }),

      clearCart: () => {
        console.log('[CART STORE] clearCart — vaciando carrito')
        set({ items: [], couponCode: null, discount: 0 })
      },

      setCoupon: (code, discount) => {
        console.log(`[CART STORE] setCoupon — código: "${code}", descuento: $${discount}`)
        set({ couponCode: code, discount })
      },

      clearCoupon: () => {
        console.log('[CART STORE] clearCoupon — eliminando cupón')
        set({ couponCode: null, discount: 0 })
      },

      getTotalItems: () => {
        const state = get()
        return state.items.reduce((sum, item) => sum + item.quantity, 0)
      },

      getTotalPrice: () => {
        const state = get()
        return state.items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0,
        )
      },
    }),
    {
      name: 'cart-storage',
    },
  ),
)
