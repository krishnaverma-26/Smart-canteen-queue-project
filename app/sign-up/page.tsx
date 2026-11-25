import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { AuthForm } from '@/components/auth-form'
import { auth } from '@/lib/auth'
import { sanitizeReturnTo } from '@/lib/navigation'

export default async function SignUpPage({ searchParams }: { searchParams: Promise<{ returnTo?: string | string[] }> }) {
  const session = await auth.api.getSession({ headers: await headers() })
  const { returnTo: requestedReturnTo } = await searchParams
  const returnTo = sanitizeReturnTo(requestedReturnTo)
  if (session?.user) redirect(returnTo)
  return <AuthForm mode="sign-up" returnTo={returnTo} />
}
