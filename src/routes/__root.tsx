import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CartDrawer } from '@/components/features/cart/CartDrawer'
import { ErrorBoundary } from '@/components/shared/ErrorBoundary'
import { NotFound } from '@/components/shared/NotFound'

interface RouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
  notFoundComponent: () => (
    <>
      <Header />
      <main className="min-h-screen">
        <NotFound />
      </main>
      <Footer />
    </>
  ),
})

function RootLayout() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
      <Footer />
      <CartDrawer />
      <Toaster position="top-right" />
    </>
  )
}
