# CLAUDE.md - Frontend (React SPA)

## 📋 PROJECT OVERVIEW

This is the **frontend application** for a **merchandising platform** where users can:
- Browse and purchase custom-designed merchandise
- Upload and manage their own designs
- Complete checkout with Stripe payments
- Track orders in real-time
- Access admin panel for order management

**Target Scale:** Tens of thousands of users per month

---

## 🚀 TECH STACK

### Core
- **React 18+** - UI library with Hooks
- **TypeScript** - Type safety
- **Vite** - Fast build tool and dev server
- **TanStack Router** - Type-safe, file-based routing

### State Management
- **Zustand** - Lightweight global state (auth, cart, UI)
- **React Query (TanStack Query)** - Server state, caching, and data fetching

### Styling
- **Tailwind CSS** - Utility-first CSS
- **shadcn/ui** - Accessible component library
- **Headless UI** - Unstyled accessible components

### Backend Integration
- **Supabase Client** - Auth, Storage, and Database access
- **Axios** - HTTP client for backend API

### Forms & Validation
- **React Hook Form** - Form state management
- **Zod** - Schema validation

### Payments
- **@stripe/stripe-js** - Stripe integration
- **@stripe/react-stripe-js** - React components for Stripe

### Utilities
- **date-fns** - Date formatting
- **react-hot-toast** - Toast notifications
- **react-dropzone** - File uploads

### Deployment
- **Netlify** - Static site hosting with CDN

---

## 📁 PROJECT STRUCTURE

```
merchanding/
├── public/
│   ├── index.html
│   └── assets/                     # Static assets
│
├── src/
│   ├── main.tsx                    # App entry point
│   ├── App.tsx                     # Root component
│   │
│   ├── routes/                     # File-based routing (TanStack Router)
│   │   ├── __root.tsx              # Root layout (Outlet, Header, Footer)
│   │   ├── index.tsx               # / (HomePage)
│   │   ├── browse.tsx              # /browse (BrowsePage)
│   │   ├── campaigns.$campaignId.tsx # /campaigns/:id (CampaignDetailPage)
│   │   ├── (auth)/                 # Auth pages (public)
│   │   │   ├── login.tsx           # /login
│   │   │   └── register.tsx        # /register
│   │   ├── (authenticated)/        # Protected routes (beforeLoad guard)
│   │   │   ├── route.tsx           # Auth guard via beforeLoad
│   │   │   ├── cart.tsx            # /cart
│   │   │   ├── checkout.tsx        # /checkout
│   │   │   ├── orders/
│   │   │   │   ├── index.tsx       # /orders
│   │   │   │   ├── $orderId.tsx    # /orders/:id
│   │   │   │   └── $orderId.success.tsx # /orders/:id/success
│   │   │   ├── profile.tsx         # /profile
│   │   │   └── designs.tsx         # /designs
│   │   └── (admin)/                # Admin routes (beforeLoad admin guard)
│   │       ├── route.tsx           # Admin guard via beforeLoad
│   │       ├── dashboard.tsx       # /admin/dashboard
│   │       ├── orders-management.tsx # /admin/orders
│   │       ├── designs-management.tsx # /admin/designs
│   │       └── campaigns-management.tsx # /admin/campaigns
│   │
│   ├── components/                 # Reusable components
│   │   ├── ui/                     # shadcn/ui primitives
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── card.tsx
│   │   │   └── ...
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── MainLayout.tsx
│   │   ├── features/               # Feature-specific components
│   │   │   ├── cart/
│   │   │   │   ├── CartItem.tsx
│   │   │   │   ├── CartSummary.tsx
│   │   │   │   ├── CartDrawer.tsx
│   │   │   │   └── AddToCartButton.tsx
│   │   │   ├── checkout/
│   │   │   │   ├── CheckoutForm.tsx
│   │   │   │   ├── ShippingForm.tsx
│   │   │   │   ├── PaymentForm.tsx
│   │   │   │   └── OrderSummary.tsx
│   │   │   ├── orders/
│   │   │   │   ├── OrderCard.tsx
│   │   │   │   ├── OrderStatusBadge.tsx
│   │   │   │   ├── OrderTracking.tsx
│   │   │   │   └── OrderItemsList.tsx
│   │   │   ├── designs/
│   │   │   │   ├── DesignCard.tsx
│   │   │   │   ├── DesignUploader.tsx
│   │   │   │   ├── DesignPreview.tsx
│   │   │   │   └── DesignGallery.tsx
│   │   │   ├── campaigns/
│   │   │   │   ├── CampaignCard.tsx
│   │   │   │   └── CampaignGrid.tsx
│   │   │   └── admin/
│   │   │       ├── OrdersTable.tsx
│   │   │       ├── OrderDetailModal.tsx
│   │   │       ├── StatusUpdateForm.tsx
│   │   │       └── DesignApprovalCard.tsx
│   │   └── shared/                 # Shared components
│   │       ├── LoadingSpinner.tsx
│   │       ├── ErrorBoundary.tsx
│   │       ├── EmptyState.tsx
│   │       ├── ProtectedContent.tsx
│   │       └── ImageWithFallback.tsx
│   │
│   ├── hooks/                      # Custom React hooks
│   │   ├── useAuth.ts              # Auth state and methods
│   │   ├── useCart.ts              # Cart operations
│   │   ├── useOrders.ts            # Order queries
│   │   ├── useDesigns.ts           # Design queries
│   │   ├── useCampaigns.ts         # Campaign queries
│   │   ├── useAdmin.ts             # Admin operations
│   │   └── useDebounce.ts          # Utility hook
│   │
│   ├── store/                      # Zustand stores
│   │   ├── authStore.ts            # Auth state (user, session)
│   │   ├── cartStore.ts            # Cart state (items, totals)
│   │   └── uiStore.ts              # UI state (modals, drawers)
│   │
│   ├── services/                   # API communication
│   │   ├── api.ts                  # Axios instance + interceptors
│   │   ├── supabase.ts             # Supabase client
│   │   ├── auth.service.ts         # Auth endpoints
│   │   ├── designs.service.ts      # Designs CRUD
│   │   ├── campaigns.service.ts    # Campaigns CRUD
│   │   ├── products.service.ts     # Products API
│   │   ├── orders.service.ts       # Orders API
│   │   ├── payments.service.ts     # Stripe/payment endpoints
│   │   ├── admin.service.ts        # Admin operations
│   │   └── upload.service.ts       # File upload to Supabase Storage
│   │
│   ├── types/                      # TypeScript type definitions
│   │   ├── index.ts                # Barrel exports
│   │   ├── user.types.ts
│   │   ├── design.types.ts
│   │   ├── campaign.types.ts
│   │   ├── product.types.ts
│   │   ├── cart.types.ts
│   │   ├── order.types.ts
│   │   └── api.types.ts
│   │
│   ├── utils/                      # Utility functions
│   │   ├── formatters.ts           # Date, currency formatters
│   │   ├── validators.ts           # Validation helpers
│   │   ├── constants.ts            # App constants
│   │   ├── storage.ts              # localStorage helpers
│   │   └── helpers.ts              # General utilities
│   │
│   ├── config/
│   │   ├── env.ts                  # Environment variables
│   │   ├── supabase.config.ts      # Supabase config
│   │   └── stripe.config.ts        # Stripe config
│   │
│   └── styles/
│       ├── index.css               # Global styles + Tailwind imports
│       └── fonts.css               # Custom fonts
│
├── .env.local                      # Local environment variables
├── .env.example                    # Example env file
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── .eslintrc.cjs
├── .prettierrc
└── README.md
```

---

## 🔧 ENVIRONMENT VARIABLES

Create `.env.local` file:

```bash
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Backend API
VITE_API_URL=http://localhost:5000/api
# Production: https://your-backend.onrender.com/api

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...

# App
VITE_APP_URL=http://localhost:5173
```

**IMPORTANT:** All Vite env vars must start with `VITE_`

---

## 🎯 CODING CONVENTIONS

### Component Structure

```tsx
// OrderCard.tsx
import { FC } from 'react';
import { Order } from '@/types';
import { formatDate, formatCurrency } from '@/utils/formatters';
import { Button } from '@/components/ui/button';

interface OrderCardProps {
  order: Order;
  onViewDetails: (orderId: string) => void;
}

export const OrderCard: FC<OrderCardProps> = ({ order, onViewDetails }) => {
  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">{order.orderNumber}</h3>
          <p className="text-sm text-muted-foreground">
            {formatDate(order.createdAt)}
          </p>
        </div>
        <div className="text-right">
          <p className="font-bold">{formatCurrency(order.total)}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(order.id)}
          >
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
};
```

### Custom Hooks Pattern

```tsx
// useOrders.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersService } from '@/services/orders.service';
import { toast } from 'react-hot-toast';

export const useOrders = () => {
  const queryClient = useQueryClient();

  // Fetch user orders
  const {
    data: orders,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['orders'],
    queryFn: ordersService.getUserOrders,
  });

  // Fetch single order
  const useOrder = (orderId: string) =>
    useQuery({
      queryKey: ['orders', orderId],
      queryFn: () => ordersService.getOrderById(orderId),
      enabled: !!orderId,
    });

  // Track order mutation
  const trackOrderMutation = useMutation({
    mutationFn: ordersService.trackOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Order status updated');
    },
    onError: (error) => {
      toast.error('Failed to track order');
      console.error(error);
    },
  });

  return {
    orders,
    isLoading,
    error,
    useOrder,
    trackOrder: trackOrderMutation.mutate,
  };
};
```

### Zustand Store Pattern

```tsx
// cartStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, CartState } from '@/types/cart.types';

interface CartStore extends CartState {
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id);
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity: 1 }] };
        }),

      removeItem: (itemId) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== itemId),
        })),

      updateQuantity: (itemId, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === itemId ? { ...i, quantity } : i
          ),
        })),

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        const state = get();
        return state.items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getTotalPrice: () => {
        const state = get();
        return state.items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      },
    }),
    {
      name: 'cart-storage', // localStorage key
    }
  )
);
```

### Service Layer Pattern

```tsx
// orders.service.ts
import { api } from './api';
import { Order, CreateOrderDto } from '@/types';

export const ordersService = {
  // Get user's orders
  getUserOrders: async (): Promise<Order[]> => {
    const { data } = await api.get('/orders');
    return data;
  },

  // Get single order by ID
  getOrderById: async (orderId: string): Promise<Order> => {
    const { data } = await api.get(`/orders/${orderId}`);
    return data;
  },

  // Create new order
  createOrder: async (orderData: CreateOrderDto): Promise<Order> => {
    const { data } = await api.post('/orders', orderData);
    return data;
  },

  // Track order
  trackOrder: async (orderId: string): Promise<Order> => {
    const { data } = await api.get(`/orders/${orderId}/track`);
    return data;
  },
};
```

### Axios Configuration

```tsx
// services/api.ts
import axios from 'axios';
import { supabase } from './supabase';

const API_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
api.interceptors.request.use(
  async (config) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### Supabase Client Setup

```tsx
// services/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### Authentication Hook

```tsx
// hooks/useAuth.ts
import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { supabase } from '@/services/supabase';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'react-hot-toast';

export const useAuth = () => {
  const navigate = useNavigate();
  const { user, setUser, clearUser, isAdmin } = useAuthStore();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
      }
    });

    // Listen to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        clearUser();
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser, clearUser]);

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
        },
      });

      if (error) throw error;

      toast.success('Account created! Please check your email.');
      return data;
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign up');
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success('Welcome back!');
      navigate({ to: '/browse' });
      return data;
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in');
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      clearUser();
      navigate({ to: '/login' });
      toast.success('Signed out successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign out');
      throw error;
    }
  };

  return {
    user,
    isAuthenticated: !!user,
    isAdmin: isAdmin(),
    signUp,
    signIn,
    signOut,
  };
};
```

### File Upload to Supabase Storage

```tsx
// services/upload.service.ts
import { supabase } from './supabase';

export const uploadService = {
  uploadDesign: async (file: File, userId: string): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;
    const filePath = `designs/${fileName}`;

    const { data, error } = await supabase.storage
      .from('designs')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from('designs').getPublicUrl(data.path);

    return publicUrl;
  },

  deleteDesign: async (filePath: string): Promise<void> => {
    const { error } = await supabase.storage.from('designs').remove([filePath]);

    if (error) throw error;
  },
};
```

---

## 🎨 UI/UX PATTERNS

### Loading States

```tsx
// Use React Query's loading states
const { data: orders, isLoading } = useOrders();

if (isLoading) {
  return <LoadingSpinner />;
}

return <OrdersList orders={orders} />;
```

### Error Handling

```tsx
const { data, error } = useQuery({
  queryKey: ['orders'],
  queryFn: ordersService.getUserOrders,
});

if (error) {
  return (
    <EmptyState
      title="Failed to load orders"
      description={error.message}
      action={<Button onClick={refetch}>Try Again</Button>}
    />
  );
}
```

### Toast Notifications

```tsx
import { toast } from 'react-hot-toast';

// Success
toast.success('Order placed successfully!');

// Error
toast.error('Failed to process payment');

// Loading with promise
toast.promise(
  createOrder(orderData),
  {
    loading: 'Creating order...',
    success: 'Order created!',
    error: 'Failed to create order',
  }
);
```

---

## 🔐 AUTHENTICATION FLOW

### Protected Route Guard (beforeLoad)

TanStack Router uses `beforeLoad` to protect routes — no wrapper components needed. Auth guards are defined in layout route files.

```tsx
// routes/(authenticated)/route.tsx
import { createFileRoute, redirect, Outlet } from '@tanstack/react-router';
import { supabase } from '@/services/supabase';

export const Route = createFileRoute('/(authenticated)')({
  beforeLoad: async () => {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      throw redirect({
        to: '/login',
        search: { redirect: location.pathname },
      });
    }
  },
  component: () => <Outlet />,
});
```

### Admin Route Guard (beforeLoad)

```tsx
// routes/(admin)/route.tsx
import { createFileRoute, redirect, Outlet } from '@tanstack/react-router';
import { supabase } from '@/services/supabase';
import { useAuthStore } from '@/store/authStore';

export const Route = createFileRoute('/(admin)')({
  beforeLoad: async () => {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      throw redirect({ to: '/login' });
    }

    const { isAdmin } = useAuthStore.getState();
    if (!isAdmin()) {
      throw redirect({ to: '/' });
    }
  },
  component: () => <Outlet />,
});
```

### Root Layout

```tsx
// routes/__root.tsx
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { QueryClient } from '@tanstack/react-query';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

interface RouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <>
      <Header />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </>
  ),
});
```

---

## 💳 STRIPE INTEGRATION

### Checkout Flow

```tsx
// components/features/checkout/PaymentForm.tsx
import { useState } from 'react';
import {
  useStripe,
  useElements,
  PaymentElement,
} from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cartStore';
import { paymentsService } from '@/services/payments.service';
import { toast } from 'react-hot-toast';

export const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const { items, getTotalPrice, clearCart } = useCartStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);

    try {
      // Create payment intent on backend
      const { clientSecret, orderId } = await paymentsService.createPaymentIntent({
        items,
        total: getTotalPrice(),
      });

      // Confirm payment
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
      });

      if (error) {
        toast.error(error.message || 'Payment failed');
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        clearCart();
        toast.success('Payment successful!');
        window.location.href = `/orders/${orderId}/success`;
      }
    } catch (error: any) {
      toast.error(error.message || 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <Button type="submit" disabled={!stripe || isProcessing} className="w-full">
        {isProcessing ? 'Processing...' : `Pay $${getTotalPrice()}`}
      </Button>
    </form>
  );
};
```

---

## 📊 PERFORMANCE OPTIMIZATIONS

### Code Splitting

TanStack Router handles code splitting automatically with `autoCodeSplitting` in the Vite plugin, or manually with `lazyRouteComponent`:

```tsx
// vite.config.ts — automatic code splitting
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';

export default defineConfig({
  plugins: [
    TanStackRouterVite({ autoCodeSplitting: true }), // Must come before react()
    react(),
  ],
});

// Or manual lazy loading in route files:
// routes/(admin)/dashboard.tsx
import { createFileRoute } from '@tanstack/react-router';
import { lazyRouteComponent } from '@tanstack/react-router';

export const Route = createFileRoute('/(admin)/dashboard')({
  component: lazyRouteComponent(() => import('@/components/features/admin/DashboardView')),
});
```

### Image Optimization

```tsx
// components/shared/ImageWithFallback.tsx
import { useState } from 'react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  fallback?: string;
  className?: string;
}

export const ImageWithFallback = ({
  src,
  alt,
  fallback = '/placeholder.png',
  className,
}: ImageWithFallbackProps) => {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={() => setImgSrc(fallback)}
      loading="lazy"
    />
  );
};
```

### React Query + TanStack Router Configuration

```tsx
// main.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (v5: renamed from cacheTime)
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Create router with queryClient in context
const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultPreload: 'intent',
});

// Type registration for type-safe navigation
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

// App entry
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

---

## 🚀 DEPLOYMENT (Netlify)

### Build Configuration

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

### Deployment Steps

1. **Connect Repository**
   - Link GitHub repo to Netlify

2. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **Add Environment Variables**
   - Add all `VITE_*` variables in Netlify dashboard

4. **Deploy**
   - Auto-deploys on every push to main branch

---

## ✅ BEST PRACTICES

### DO's
- ✅ Use TypeScript for all files
- ✅ Always handle loading and error states
- ✅ Use React Query for server state
- ✅ Use Zustand only for client state (cart, UI)
- ✅ Keep components small and focused
- ✅ Use custom hooks for reusable logic
- ✅ Implement proper error boundaries
- ✅ Use environment variables for config
- ✅ Lazy load routes for better performance
- ✅ Show user feedback (toasts, loading spinners)

### DON'Ts
- ❌ Don't store server data in Zustand (use React Query)
- ❌ Don't put business logic in components
- ❌ Don't commit `.env.local` file
- ❌ Don't ignore TypeScript errors
- ❌ Don't use `any` type unless absolutely necessary
- ❌ Don't make API calls directly in components
- ❌ Don't store sensitive data in localStorage
- ❌ Don't ignore accessibility

---

## 🔍 DEBUGGING TIPS

### React Query DevTools

```tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

<QueryClientProvider client={queryClient}>
  <App />
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>
```

### Console Logging

```tsx
// Only log in development
if (import.meta.env.DEV) {
  console.log('Debug info:', data);
}
```

---

## 📚 USEFUL COMMANDS

```bash
# Development
npm run dev                 # Start dev server (http://localhost:5173)

# Build
npm run build              # Production build
npm run preview            # Preview production build

# Code Quality
npm run lint               # Run ESLint
npm run type-check         # TypeScript check

# Dependencies
npm install                # Install dependencies
npm update                 # Update dependencies
```

---

## 🎯 IMPLEMENTATION CHECKLIST

### Phase 1: Setup
- [ ] Initialize Vite + React + TypeScript project
- [ ] Install and configure Tailwind CSS
- [ ] Setup Supabase client
- [ ] Configure TanStack Router (file-based routing + Vite plugin)
- [ ] Setup Zustand stores
- [ ] Setup React Query
- [ ] Add shadcn/ui components

### Phase 2: Authentication
- [ ] Login page
- [ ] Register page
- [ ] Protected routes
- [ ] Auth store
- [ ] useAuth hook

### Phase 3: Core Features
- [ ] Browse campaigns page
- [ ] Product detail page
- [ ] Cart functionality
- [ ] Checkout flow
- [ ] Stripe integration
- [ ] Order success page
- [ ] Order tracking page

### Phase 4: User Features
- [ ] Design upload
- [ ] User profile
- [ ] Order history
- [ ] Design management

### Phase 5: Admin Panel
- [ ] Admin dashboard
- [ ] Orders management
- [ ] Designs approval
- [ ] Campaign management

### Phase 6: Polish
- [ ] Loading states everywhere
- [ ] Error handling
- [ ] Toast notifications
- [ ] Responsive design
- [ ] Accessibility
- [ ] Performance optimization

### Phase 7: Deployment
- [ ] Environment variables setup
- [ ] Build configuration
- [ ] Netlify deployment
- [ ] Test production build

---

## 📞 SUPPORT & RESOURCES

- **React Docs:** https://react.dev
- **Vite Docs:** https://vitejs.dev
- **React Query:** https://tanstack.com/query
- **Zustand:** https://github.com/pmndrs/zustand
- **Supabase Docs:** https://supabase.com/docs
- **Stripe Docs:** https://stripe.com/docs
- **Tailwind CSS:** https://tailwindcss.com
- **shadcn/ui:** https://ui.shadcn.com

---

**Last Updated:** 2026-02-16

**Version:** 1.0

**Team Size:** 3 developers

**Target Scale:** Tens of thousands of users/month
