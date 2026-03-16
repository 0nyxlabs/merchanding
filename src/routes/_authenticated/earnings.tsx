import { createFileRoute } from '@tanstack/react-router'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EarningsSummaryCards } from '@/components/features/earnings/EarningsSummaryCards'
import { EarningsTable } from '@/components/features/earnings/EarningsTable'
import { TransactionsTable } from '@/components/features/earnings/TransactionsTable'
import { RequestPayoutForm } from '@/components/features/earnings/RequestPayoutForm'
import { useProfile } from '@/hooks/useAuth'
import { useEarnings, useTransactions } from '@/hooks/useEarnings'
import type { UserProfile } from '@/types'

export const Route = createFileRoute('/_authenticated/earnings')({
  component: EarningsPage,
})

function EarningsPage() {
  const { data: profile, isLoading: profileLoading } = useProfile()
  const { data: earnings, isLoading: earningsLoading } = useEarnings()
  const { data: transactions, isLoading: transactionsLoading } = useTransactions()

  if (profileLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 space-y-6">
        <Skeleton className="h-8 w-40" />
        <div className="grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  const userProfile = profile as UserProfile | undefined

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Earnings</h1>
        <p className="mt-1 text-muted-foreground">
          Track your commissions, transactions, and request payouts.
        </p>
      </div>

      {/* Summary cards */}
      {userProfile && <EarningsSummaryCards profile={userProfile} />}

      <Separator />

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left: earnings + transactions */}
        <div className="space-y-8 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Earnings History</CardTitle>
            </CardHeader>
            <CardContent>
              {earningsLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              ) : (
                <EarningsTable earnings={earnings ?? []} />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              {transactionsLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              ) : (
                <TransactionsTable transactions={transactions ?? []} />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: request payout */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Request Payout</CardTitle>
            </CardHeader>
            <CardContent>
              <RequestPayoutForm
                availableBalance={userProfile?.availableBalance ?? 0}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
