import type { FC } from 'react'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatDate } from '@/utils/formatters'
import { EARNING_STATUS } from '@/utils/constants'
import type { Earning } from '@/types'

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive'> = {
  [EARNING_STATUS.AVAILABLE]: 'default',
  [EARNING_STATUS.PENDING]: 'secondary',
  [EARNING_STATUS.PAID]: 'secondary',
  [EARNING_STATUS.CANCELLED]: 'destructive',
}

interface EarningsTableProps {
  earnings: Earning[]
}

export const EarningsTable: FC<EarningsTableProps> = ({ earnings }) => {
  if (earnings.length === 0) {
    return (
      <p className="text-center text-sm text-muted-foreground py-8">
        No earnings yet.
      </p>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-muted-foreground">
            <th className="pb-3 text-left font-medium">Date</th>
            <th className="pb-3 text-left font-medium">Type</th>
            <th className="pb-3 text-left font-medium">Description</th>
            <th className="pb-3 text-left font-medium">Status</th>
            <th className="pb-3 text-right font-medium">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {earnings.map((earning) => (
            <tr key={earning.id}>
              <td className="py-3 text-muted-foreground">{formatDate(earning.createdAt)}</td>
              <td className="py-3 capitalize">{earning.type}</td>
              <td className="py-3 text-muted-foreground">{earning.description ?? '—'}</td>
              <td className="py-3">
                <Badge variant={statusVariant[earning.status] ?? 'secondary'} className="capitalize">
                  {earning.status}
                </Badge>
              </td>
              <td className="py-3 text-right font-medium text-green-600">
                +{formatCurrency(earning.amount)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
