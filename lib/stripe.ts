import 'server-only'

import Stripe from 'stripe'

let stripe: Stripe | undefined

export function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) throw new Error('Stripe is not configured for this deployment.')
  stripe ??= new Stripe(secretKey)
  return stripe
}
