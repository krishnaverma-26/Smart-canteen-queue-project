'use server'

import { and, eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { orders } from '@/lib/db-schema'
import { estimateOrderWaitMinutes } from '@/lib/products'
import { getStripe } from '@/lib/stripe'

export async function confirmPaidOrder(sessionId: string) {
  if (!/^cs_(test|live)_[a-zA-Z0-9_]+$/.test(sessionId)) {
    return { ok: false as const }
  }

  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return { ok: false as const }

  try {
    const stripeSession = await getStripe().checkout.sessions.retrieve(sessionId)
    const orderId = stripeSession.metadata?.orderId
    if (
      stripeSession.mode !== 'payment'
      || stripeSession.currency !== 'inr'
      || stripeSession.payment_status !== 'paid'
      || stripeSession.metadata?.userId !== session.user.id
      || !orderId
    ) {
      return { ok: false as const }
    }

    const [existingOrder] = await db
      .select({ id: orders.id, amountTotal: orders.amountTotal, items: orders.items })
      .from(orders)
      .where(and(
        eq(orders.id, orderId),
        eq(orders.userId, session.user.id),
        eq(orders.stripeSessionId, stripeSession.id),
      ))
      .limit(1)

    if (!existingOrder) return { ok: false as const }

    await db
      .update(orders)
      .set({
        status: 'paid',
        amountTotal: stripeSession.amount_total ?? existingOrder.amountTotal,
        waitEstimateMinutes: estimateOrderWaitMinutes(existingOrder.items),
      })
      .where(and(
        eq(orders.id, existingOrder.id),
        eq(orders.userId, session.user.id),
        eq(orders.stripeSessionId, stripeSession.id),
      ))

    const customerOrders = await db
      .select({ items: orders.items })
      .from(orders)
      .where(and(eq(orders.userId, session.user.id), eq(orders.status, 'paid')))
    const averageWaitMinutes = customerOrders.length
      ? Math.round(customerOrders.reduce((sum, order) => sum + estimateOrderWaitMinutes(order.items), 0) / customerOrders.length)
      : null

    revalidatePath('/')
    revalidatePath('/checkout/success')

    return { ok: true as const, averageWaitMinutes }
  } catch {
    return { ok: false as const }
  }
}
