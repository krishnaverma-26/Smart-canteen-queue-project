import type { StoredOrderItem } from '@/lib/db-schema'

export type OrderView = {
  id: string
  status: 'pending' | 'paid'
  items: StoredOrderItem[]
  amountTotal: number
  waitEstimateMinutes: number
  createdAt: string
}
