'use server'

import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { orders } from '@/lib/db-schema'
import { estimateOrderWaitMinutes, MENU_ITEMS, MAX_CART_QUANTITY, MAX_ITEM_QUANTITY } from '@/lib/products'
import { getStripe } from '@/lib/stripe'

type CartEntry = { id: string; quantity: number }
type CheckoutResult =
  | { ok: true; clientSecret: string }
  | { ok: false; message: string }

function getSafeOrigin(host: string, forwardedProtocol: string | null, requestOrigin: string | null) {
  if (!/^[a-z0-9.-]+(?::\d{1,5})?$/i.test(host)) {
    throw new Error('Unable to determine the checkout return address.')
  }

  if (requestOrigin) {
    let origin: URL
    try {
      origin = new URL(requestOrigin)
    } catch {
      throw new Error('Unable to determine the checkout return address.')
    }

    if (origin.origin !== requestOrigin || !['http:', 'https:'].includes(origin.protocol)) {
      throw new Error('Unable to determine the checkout return address.')
    }

    const requestHost = host.toLowerCase()
    const originHost = origin.host.toLowerCase()
    const isLocalOrigin = origin.protocol === 'http:' && /^(localhost|127\.0\.0\.1)(:\d{1,5})?$/.test(originHost)
    const isV0PreviewOrigin = origin.protocol === 'https:'
      && origin.hostname.endsWith('.v0.build')
      && requestHost.endsWith('.vercel.run')

    if (originHost !== requestHost && !isLocalOrigin && !isV0PreviewOrigin) {
      throw new Error('Unable to determine the checkout return address.')
    }

    return origin.origin
  }

  const protocol = forwardedProtocol === 'http' || forwardedProtocol === 'https'
    ? forwardedProtocol
    : host.startsWith('localhost') || host.startsWith('127.0.0.1') ? 'http' : 'https'
  return `${protocol}://${host}`
}

export async function createCheckoutSession(
  cart: CartEntry[],
  idempotencyKey: string,
): Promise<CheckoutResult> {
  const requestHeaders = await headers()
  const authSession = await auth.api.getSession({ headers: requestHeaders })
  if (!authSession?.user) {
    return { ok: false, message: 'Please sign in before placing an order.' }
  }

  if (!process.env.STRIPE_SECRET_KEY || !process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    return {
      ok: false,
      message: 'Stripe is connected, but its test credentials are not available to this preview yet. Finish claiming the Stripe sandbox in v0, then try again.',
    }
  }

  if (!Array.isArray(cart) || cart.length === 0 || cart.length > MAX_CART_QUANTITY) {
    return { ok: false, message: 'Your cart is empty or too large. Review it and try again.' }
  }
  if (!/^[a-f0-9-]{36}$/i.test(idempotencyKey)) {
    return { ok: false, message: 'This checkout could not be validated. Please try again.' }
  }

  const seen = new Set<string>()
  let totalQuantity = 0
  for (const entry of cart) {
    if (!entry || typeof entry.id !== 'string' || !Number.isInteger(entry.quantity)) {
      return { ok: false, message: 'One or more cart items are invalid.' }
    }
    if (seen.has(entry.id) || entry.quantity < 1 || entry.quantity > MAX_ITEM_QUANTITY) {
      return { ok: false, message: 'Review item quantities and try again.' }
    }
    if (!MENU_ITEMS.some((item) => item.id === entry.id)) {
      return { ok: false, message: 'One of the selected dishes is no longer on the menu.' }
    }
    seen.add(entry.id)
    totalQuantity += entry.quantity
  }
  if (totalQuantity > MAX_CART_QUANTITY) {
    return { ok: false, message: 'Your cart has reached the item limit.' }
  }

  try {
    const host = requestHeaders.get('x-forwarded-host')?.split(',')[0]?.trim()
      ?? requestHeaders.get('host')
    if (!host) return { ok: false, message: 'Checkout could not determine the return address.' }

    const origin = getSafeOrigin(
      host,
      requestHeaders.get('x-forwarded-proto')?.split(',')[0]?.trim() ?? null,
      requestHeaders.get('origin'),
    )
    const orderId = crypto.randomUUID()
    const orderItems = cart.map(({ id, quantity }) => {
      const item = MENU_ITEMS.find((menuItem) => menuItem.id === id)!
      return { id: item.id, name: item.name, quantity, unitPrice: item.price }
    })
    const amountTotal = orderItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0) * 100
    const waitEstimateMinutes = estimateOrderWaitMinutes(cart)
    const session = await getStripe().checkout.sessions.create({
      ui_mode: 'embedded_page',
      redirect_on_completion: 'always',
      return_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      mode: 'payment',
      line_items: cart.map(({ id, quantity }) => {
        const item = MENU_ITEMS.find((menuItem) => menuItem.id === id)!
        return {
          price_data: {
            currency: 'inr',
            unit_amount: item.price * 100,
            product_data: { name: item.name, description: item.detail },
          },
          quantity,
        }
      }),
      metadata: {
        itemCount: String(totalQuantity),
        orderId,
        userId: authSession.user.id,
      },
    }, { idempotencyKey: `${authSession.user.id}:${idempotencyKey}` })

    if (!session.client_secret || session.metadata?.userId !== authSession.user.id || !session.metadata.orderId) {
      return { ok: false, message: 'Stripe could not start secure checkout. Please try again.' }
    }

    await db.insert(orders).values({
      id: session.metadata.orderId,
      userId: authSession.user.id,
      stripeSessionId: session.id,
      status: 'pending',
      items: orderItems,
      amountTotal,
      waitEstimateMinutes,
    }).onConflictDoNothing({ target: orders.stripeSessionId })

    return { ok: true, clientSecret: session.client_secret }
  } catch {
    return {
      ok: false,
      message: 'We could not start secure checkout. Check the Stripe sandbox connection and try again.',
    }
  }
}
