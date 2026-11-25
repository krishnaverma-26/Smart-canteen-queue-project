'use client'

import { useCallback, useMemo, useState } from 'react'
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { ArrowLeft, ArrowRight, Check, CreditCard, LockKeyhole, ShieldCheck, X } from 'lucide-react'
import { createCheckoutSession } from '@/app/actions/checkout'
import { formatRupees } from '@/lib/products'

type CheckoutLine = { id: string; name: string; quantity: number; price: number }

type CheckoutModalProps = {
  items: CheckoutLine[]
  total: number
  idempotencyKey: string
  onClose: () => void
}

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
const stripePromise = publishableKey ? loadStripe(publishableKey) : null

export function CheckoutModal({ items, total, idempotencyKey, onClose }: CheckoutModalProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const requestClientSecret = useCallback(async () => {
    const result = await createCheckoutSession(
      items.map(({ id, quantity }) => ({ id, quantity })),
      idempotencyKey,
    )
    if (!result.ok) throw new Error(result.message)
    return result.clientSecret
  }, [idempotencyKey, items])

  const checkoutOptions = useMemo(() => clientSecret ? { clientSecret } : null, [clientSecret])

  async function beginCheckout() {
    setPending(true)
    setError(null)
    try {
      const secret = await requestClientSecret()
      setClientSecret(secret)
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : 'Checkout could not be started.')
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="modal-backdrop payment-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className={`payment-modal${clientSecret ? ' payment-modal-active' : ''}`} role="dialog" aria-modal="true" aria-labelledby="payment-title">
        <button className="modal-close" onClick={onClose} aria-label="Close payment window"><X size={18} /></button>
        {clientSecret && stripePromise && checkoutOptions ? (
          <>
            <button className="payment-back" onClick={() => { setClientSecret(null); setError(null) }}><ArrowLeft size={15} /> Back to order</button>
            <span className="eyebrow"><LockKeyhole size={12} /> SECURE STRIPE CHECKOUT</span>
            <h2 id="payment-title">Choose how to pay</h2>
            <p className="payment-copy">Your payment details are encrypted and handled securely by Stripe.</p>
            <div className="embedded-checkout">
              <EmbeddedCheckoutProvider stripe={stripePromise} options={checkoutOptions}>
                <EmbeddedCheckout />
              </EmbeddedCheckoutProvider>
            </div>
          </>
        ) : (
          <>
            <div className="payment-heading-mark"><CreditCard size={19} /></div>
            <span className="eyebrow"><ShieldCheck size={12} /> SECURE CAMPUS CHECKOUT</span>
            <h2 id="payment-title">Review &amp; pay</h2>
            <p className="payment-copy">Pay securely online via Stripe. Paid orders are saved to your account; kitchen ticketing is not connected in this preview.</p>
            <div className="payment-order-list">
              {items.map((item) => (
                <div className="payment-order-line" key={item.id}>
                  <span><b>{item.quantity}×</b> {item.name}</span>
                  <strong>{formatRupees(item.price * item.quantity)}</strong>
                </div>
              ))}
            </div>
            <div className="payment-total"><span>Total due</span><strong>{formatRupees(total)}</strong></div>
            <div className="payment-method-note"><span className="payment-method-icon"><Check size={14} /></span><span>UPI, cards &amp; other options appear in secure checkout</span></div>
            {error && <p className="payment-error" role="alert">{error}</p>}
            {!stripePromise && <p className="payment-error" role="status">Stripe&apos;s publishable key is not available to this preview yet.</p>}
            <button className="payment-submit" onClick={beginCheckout} disabled={pending || !stripePromise}>
              {pending ? 'Opening secure checkout…' : <>Continue to payment <span>{formatRupees(total)} <ArrowRight size={15} /></span></>}
            </button>
            <p className="payment-disclaimer"><LockKeyhole size={11} /> You won&apos;t be charged until you confirm payment.</p>
          </>
        )}
      </section>
    </div>
  )
}
