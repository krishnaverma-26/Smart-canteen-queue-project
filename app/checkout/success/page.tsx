import { and, eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { PaymentResult } from '@/components/payment-result'
import { db } from '@/lib/db'
import { orders } from '@/lib/db-schema'
import { estimateOrderWaitMinutes } from '@/lib/products'
import { getStripe } from '@/lib/stripe'

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const [{ session_id: sessionId }, requestHeaders] = await Promise.all([searchParams, headers()])
  const userSession = await auth.api.getSession({ headers: requestHeaders })
  let status: 'paid' | 'pending' | 'unconfirmed' = 'unconfirmed'
  let amount = 0
  let reference = ''
  let orderId = ''
  let waitEstimateMinutes = 0
  let averageWaitMinutes = 0

  if (userSession?.user && sessionId && /^cs_(test|live)_[a-zA-Z0-9_]+$/.test(sessionId)) {
    try {
      const stripeSession = await getStripe().checkout.sessions.retrieve(sessionId)
      const belongsToUser = stripeSession.metadata?.userId === userSession.user.id
      if (belongsToUser && stripeSession.currency === 'inr') {
        const [order] = await db
          .select()
          .from(orders)
          .where(and(
            eq(orders.userId, userSession.user.id),
            eq(orders.stripeSessionId, stripeSession.id),
          ))
          .limit(1)

        if (order) {
          amount = stripeSession.amount_total ?? order.amountTotal
          reference = stripeSession.id.slice(-8).toUpperCase()
          orderId = order.id
          waitEstimateMinutes = estimateOrderWaitMinutes(order.items)
          const customerOrders = await db
            .select({ id: orders.id, items: orders.items })
            .from(orders)
            .where(and(eq(orders.userId, userSession.user.id), eq(orders.status, 'paid')))
          const customerEstimates = customerOrders
            .filter((customerOrder) => customerOrder.id !== order.id)
            .map((customerOrder) => estimateOrderWaitMinutes(customerOrder.items))
          averageWaitMinutes = Math.round(
            [...customerEstimates, waitEstimateMinutes].reduce((sum, estimate) => sum + estimate, 0)
            / (customerEstimates.length + 1),
          )

          if (stripeSession.payment_status === 'paid') {
            status = 'paid'
          } else if (stripeSession.status === 'complete' && stripeSession.payment_status === 'unpaid') {
            status = 'pending'
          }
        }
      }
    } catch {
      status = 'unconfirmed'
    }
  }

  return (
    <PaymentResult
      status={status}
      amount={amount}
      reference={reference}
      orderId={orderId}
      sessionId={status === 'paid' && sessionId ? sessionId : ''}
      waitEstimateMinutes={waitEstimateMinutes}
      averageWaitMinutes={averageWaitMinutes}
    />
  )
}
