import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
  variantId?: string
}

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id)
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
              ),
            }
          }
          return { items: [...state.items, { ...item, quantity: 1 }] }
        }),

      removeItem: (itemId) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== itemId),
        })),

      updateQuantity: (itemId, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === itemId ? { ...i, quantity } : i,
          ),
        })),

      clearCart: () => set({ items: [] }),

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
