import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ShoppingBag, Palette, Truck } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: HomePage,
})

const features = [
  {
    icon: ShoppingBag,
    title: 'Browse Campaigns',
    description: 'Explore curated collections of custom-designed merchandise from creative designers.',
  },
  {
    icon: Palette,
    title: 'Upload Designs',
    description: 'Submit your own designs and turn them into products that people can purchase.',
  },
  {
    icon: Truck,
    title: 'Track Orders',
    description: 'Place orders with secure Stripe payments and track them from checkout to delivery.',
  },
]

function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="flex flex-col items-center justify-center px-6 py-24 text-center sm:py-32">
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Custom Merch, <span className="text-primary">Your Way</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-muted-foreground">
          Discover unique campaigns, shop custom-designed products, or upload your own designs and bring them to life.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button asChild size="lg">
            <Link to="/browse">Browse Campaigns</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/register">Create Account</Link>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-4 pb-24 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardContent className="pt-6">
                <feature.icon className="mb-4 h-10 w-10 text-primary" />
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
