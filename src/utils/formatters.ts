import { format, formatDistanceToNow } from 'date-fns'

export const formatDate = (date: string | Date): string => {
  return format(new Date(date), 'MMM dd, yyyy')
}

export const formatDateTime = (date: string | Date): string => {
  return format(new Date(date), 'MMM dd, yyyy HH:mm')
}

export const formatRelativeDate = (date: string | Date): string => {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}
