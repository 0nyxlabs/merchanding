import type { FC } from 'react'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatDate } from '@/utils/formatters'
import { TRANSACTION_TYPE } from '@/utils/constants'
import type { Transaction } from '@/types'

interface TransactionsTableProps {
  transactions: Transaction[]
}

export const TransactionsTable: FC<TransactionsTableProps> = ({ transactions }) => {
  if (transactions.length === 0) {
    return (
      <p className="text-center text-sm text-muted-foreground py-8">
        No transactions yet.
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
            <th className="pb-3 text-right font-medium">Amount</th>
            <th className="pb-3 text-right font-medium">Balance After</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {transactions.map((tx) => {
            const isCredit = tx.type === TRANSACTION_TYPE.CREDIT || tx.type === TRANSACTION_TYPE.REFUND
            return (
              <tr key={tx.id}>
                <td className="py-3 text-muted-foreground">{formatDate(tx.createdAt)}</td>
                <td className="py-3">
                  <Badge variant={isCredit ? 'default' : 'secondary'} className="capitalize">
                    {tx.type}
                  </Badge>
                </td>
                <td className="py-3 text-muted-foreground">{tx.description}</td>
                <td className={`py-3 text-right font-medium ${isCredit ? 'text-green-600' : 'text-destructive'}`}>
                  {isCredit ? '+' : '-'}{formatCurrency(Math.abs(tx.amount))}
                </td>
                <td className="py-3 text-right text-muted-foreground">
                  {tx.balanceAfter != null ? formatCurrency(tx.balanceAfter) : '—'}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
