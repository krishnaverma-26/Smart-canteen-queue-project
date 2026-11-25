'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Leaf } from 'lucide-react'
import { authClient } from '@/lib/auth-client'

export function AuthForm({ mode, returnTo = '/' }: { mode: 'sign-in' | 'sign-up'; returnTo?: string }) {
  const router = useRouter()
  const isSignUp = mode === 'sign-up'
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      const result = isSignUp
        ? await authClient.signUp.email({ name, email, password })
        : await authClient.signIn.email({ email, password })
      if (result.error) {
        setError('We could not sign you in with those details. Please check them and try again.')
        return
      }
      router.replace(returnTo)
      router.refresh()
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="auth-title">
        <a href="/" className="auth-brand"><span><Leaf size={18} /></span> greenhouse</a>
        <p className="eyebrow">YOUR CAMPUS, YOUR CANTEEN</p>
        <h1 id="auth-title">{isSignUp ? 'Join the table.' : 'Good to see you.'}</h1>
        <p className="auth-intro">{isSignUp ? 'Create an account to make lunch a little easier.' : 'Sign in to pick up right where you left off.'}</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          {isSignUp && <label>Your name<input value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" required maxLength={100} /></label>}
          <label>Email address<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required /></label>
          <label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={isSignUp ? 'new-password' : 'current-password'} minLength={8} required /></label>
          {error && <p className="auth-error" role="alert">{error}</p>}
          <button className="auth-submit" disabled={loading}>{loading ? 'One moment…' : isSignUp ? 'Create account' : 'Sign in'}</button>
        </form>
        <p className="auth-switch">{isSignUp ? 'Already have an account?' : 'New to Greenhouse?'} <Link href={`${isSignUp ? '/sign-in' : '/sign-up'}?returnTo=${encodeURIComponent(returnTo)}`}>{isSignUp ? 'Sign in' : 'Create an account'}</Link></p>
        <Link className="auth-back" href="/">Back to the menu</Link>
      </section>
    </main>
  )
}
