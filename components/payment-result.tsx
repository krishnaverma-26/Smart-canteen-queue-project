'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Check, CircleAlert, Clock3, Leaf, ShieldCheck } from 'lucide-react'
import { confirmPaidOrder } from '@/app/actions/orders'
import { formatRupees } from '@/lib/products'

type PaymentResultProps = {
  status: 'paid' | 'pending' | 'unconfirmed'
  amount: number
  reference: string
  orderId: string
  sessionId: string
  waitEstimateMinutes: number
  averageWaitMinutes: number
}

export function PaymentResult({
  status,
  amount,
  reference,
  orderId,
  sessionId,
  waitEstimateMinutes,
  averageWaitMinutes,
}: PaymentResultProps) {
  const router = useRouter()
  const pending = status === 'pending'
  const paid = status === 'paid'
  const [customerAverageWait, setCustomerAverageWait] = useState(averageWaitMinutes)
  const [orderSaveState, setOrderSaveState] = useState<'saving' | 'saved' | 'failed'>(paid && sessionId ? 'saving' : 'saved')
  const [syncAttempt, setSyncAttempt] = useState(0)

  useEffect(() => {
    if (!pending) return
    const interval = window.setInterval(() => router.refresh(), 3000)
    return () => window.clearInterval(interval)
  }, [pending, router])

  useEffect(() => {
    if (!paid || !sessionId) return
    let active = true
    setOrderSaveState('saving')
    void confirmPaidOrder(sessionId)
      .then((result) => {
        if (!active) return
        if (result.ok) {
          if (result.averageWaitMinutes !== null) setCustomerAverageWait(result.averageWaitMinutes)
          setOrderSaveState('saved')
        } else {
          setOrderSaveState('failed')
        }
      })
      .catch(() => {
        if (active) setOrderSaveState('failed')
      })
    return () => { active = false }
  }, [paid, sessionId, syncAttempt])

  return (
    <main className="payment-result-page">
      <section className="payment-result-card" aria-live="polite">
        <div className={`payment-result-icon${paid ? ' is-success' : ' is-pending'}`}>
          {paid ? <Check size={25} /> : pending ? <Clock3 size={24} /> : <CircleAlert size={24} />}
        </div>
        <a href="/" className="payment-result-brand" aria-label="Greenhouse Canteen"><span><Leaf size={17} /></span> greenhouse</a>
        <span className="eyebrow"><ShieldCheck size={12} /> SECURE PAYMENT STATUS</span>
        <h1>{paid ? 'Order confirmed' : pending ? 'Payment processing' : 'Payment not confirmed'}</h1>
        <p>{paid
          ? 'Your payment is confirmed and this order has been added to your account.'
          : pending
            ? 'Your payment is being confirmed by your payment provider. This page will update automatically—please don’t pay again.'
            : 'We could not verify a completed payment. If you were charged, please keep your Stripe receipt and contact the canteen counter.'}</p>
        {paid && <div className="payment-receipt">
          <span>Amount paid</span><strong>{formatRupees(amount / 100)}</strong>
          <span>Unique order ID</span><b className="payment-order-id">{orderId}</b>
          <span>Estimated wait for this order</span><b>~{waitEstimateMinutes} min</b>
          <span>Your average estimated wait</span><b>~{customerAverageWait || waitEstimateMinutes} min</b>
          <span>Payment reference</span><b>{reference}</b>
        </div>}
        {paid && sessionId && orderSaveState === 'saving' ? <button className="payment-return-link" disabled>Saving order to My Orders…</button> : paid && sessionId && orderSaveState === 'failed' ? <button className="payment-return-link" onClick={() => setSyncAttempt((attempt) => attempt + 1)}>Retry saving order</button> : <Link className="payment-return-link" href="/">Return to menu</Link>}
        {orderSaveState === 'failed' && <p className="payment-save-error" role="alert">Your payment is confirmed, but your order history did not sync. Retry here—there is no need to pay again.</p>}
        <small>Wait times scale with the number of items in each order. Kitchen ticketing isn&apos;t connected in this preview.</small>
      </section>
    </main>
  )
}
