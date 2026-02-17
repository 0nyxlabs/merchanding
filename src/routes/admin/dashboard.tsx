import { createFileRoute, Link } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useAdminDashboard } from '@/hooks/useAdmin'
import { formatCurrency } from '@/utils/formatters'
import { ShoppingCart, DollarSign, Palette, Megaphone } from 'lucide-react'

export const Route = createFileRoute('/admin/dashboard')({
  component: AdminDashboardPage,
})

function AdminDashboardPage() {
  const { data: stats, isLoading } = useAdminDashboard()

  const cards = [
    {
      title: 'Total Orders',
      value: stats?.totalOrders ?? 0,
      format: (v: number) => v.toLocaleString(),
      icon: ShoppingCart,
      href: '/admin/orders-management',
    },
    {
      title: 'Total Revenue',
      value: stats?.totalRevenue ?? 0,
      format: (v: number) => formatCurrency(v),
      icon: DollarSign,
      href: '/admin/orders-management',
    },
    {
      title: 'Pending Designs',
      value: stats?.pendingDesigns ?? 0,
      format: (v: number) => v.toLocaleString(),
      icon: Palette,
      href: '/admin/designs-management',
    },
    {
      title: 'Active Campaigns',
      value: stats?.activeCampaigns ?? 0,
      format: (v: number) => v.toLocaleString(),
      icon: Megaphone,
      href: '/admin/campaigns-management',
    },
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="mt-1 text-muted-foreground">
          Overview of your merchandising platform.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link key={card.title} to={card.href}>
            <Card className="transition-colors hover:bg-muted/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                <card.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <p className="text-2xl font-bold">{card.format(card.value)}</p>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
