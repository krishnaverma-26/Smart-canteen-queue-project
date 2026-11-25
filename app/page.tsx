import { and, desc, eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { CanteenDashboard } from '@/components/canteen-dashboard'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { orders } from '@/lib/db-schema'
import type { OrderView } from '@/lib/order-types'
import { estimateOrderWaitMinutes, parseCartQuery } from '@/lib/products'

export default async function Page({ searchParams }: { searchParams: Promise<{ cart?: string }> }) {
  const [{ cart: cartQuery }, requestHeaders] = await Promise.all([searchParams, headers()])
  const session = await auth.api.getSession({ headers: requestHeaders })
  const orderRows = session?.user
    ? await db
        .select()
        .from(orders)
        .where(and(eq(orders.userId, session.user.id), eq(orders.status, 'paid')))
        .orderBy(desc(orders.createdAt))
        .limit(20)
    : []
  const orderHistory: OrderView[] = orderRows.map((order) => ({
    id: order.id,
    status: 'paid',
    items: order.items,
    amountTotal: order.amountTotal,
    waitEstimateMinutes: estimateOrderWaitMinutes(order.items),
    createdAt: order.createdAt.toISOString(),
  }))

  return (
    <CanteenDashboard
      user={session?.user ? { name: session.user.name, email: session.user.email } : null}
      initialCart={parseCartQuery(cartQuery)}
      orders={orderHistory}
    />
  )
}
