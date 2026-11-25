'use client'

import Image from 'next/image'
import { useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowDownRight, ArrowRight, Bell, ChevronDown, Clock3, Coffee, Flame, Leaf, Minus, Plus, Search, ShoppingBag, Sparkles, Utensils, X, ShieldCheck } from 'lucide-react'
import { CheckoutModal } from '@/components/checkout-modal'
import { authClient } from '@/lib/auth-client'
import type { OrderView } from '@/lib/order-types'
import { estimateOrderWaitMinutes, formatRupees, MENU_CATEGORIES, MENU_ITEMS, MENU_MEAL_PERIODS, MAX_CART_QUANTITY, MAX_ITEM_QUANTITY, RECOMMENDED_ITEM_IDS, type MenuItem } from '@/lib/products'

function ItemIcon({ type }: { type: MenuItem['icon'] }) {
  const Icon = type === 'leaf' ? Leaf : type === 'flame' ? Flame : type === 'coffee' ? Coffee : Utensils
  return <Icon aria-hidden="true" size={19} strokeWidth={1.7} />
}

export function CanteenDashboard({ user, initialCart, orders }: {
  user: { name: string; email: string } | null
  initialCart: Record<string, number>
  orders: OrderView[]
}) {
  const router = useRouter()
  const [category, setCategory] = useState<string>('Everything')
  const [mealPeriod, setMealPeriod] = useState<string>('Everything')
  const [query, setQuery] = useState('')
  const [cart, setCart] = useState<Record<string, number>>(initialCart)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [orderOpen, setOrderOpen] = useState(false)
  const [checkoutKey, setCheckoutKey] = useState('')
  const checkoutButtonRef = useRef<HTMLButtonElement>(null)

  const visibleItems = useMemo(() => MENU_ITEMS.filter((item) => {
    const matchesCategory = category === 'Everything' || item.category === category
    const matchesMealPeriod = mealPeriod === 'Everything' || item.mealPeriod === mealPeriod
    const matchesSearch = `${item.name} ${item.detail}`.toLowerCase().includes(query.toLowerCase())
    return matchesCategory && matchesMealPeriod && matchesSearch
  }), [category, mealPeriod, query])

  const recommendedItems = RECOMMENDED_ITEM_IDS.map((id) => MENU_ITEMS.find((item) => item.id === id)).filter((item): item is MenuItem => Boolean(item))
  const cartItems = MENU_ITEMS.filter((item) => cart[item.id])
  const itemCount = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0)
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * cart[item.id], 0)
  const averageWaitMinutes = orders.length
    ? Math.round(orders.reduce((sum, order) => sum + estimateOrderWaitMinutes(order.items), 0) / orders.length)
    : 8

  function changeQuantity(id: string, amount: number) {
    setCart((current) => {
      const currentQuantity = current[id] ?? 0
      const next = Math.max(0, Math.min(MAX_ITEM_QUANTITY, currentQuantity + amount))
      const currentCount = Object.values(current).reduce((sum, quantity) => sum + quantity, 0)
      if (amount > 0 && currentCount >= MAX_CART_QUANTITY) return current
      const updated = { ...current }
      if (next === 0) delete updated[id]
      else updated[id] = next
      return updated
    })
  }

  function openCheckout() {
    if (!itemCount) return
    if (!user) {
      const cartParam = Object.entries(cart).map(([id, quantity]) => `${id}:${quantity}`).join(',')
      const returnTo = `/?cart=${encodeURIComponent(cartParam)}`
      router.push(`/sign-in?returnTo=${encodeURIComponent(returnTo)}`)
      return
    }
    setCheckoutKey(crypto.randomUUID())
    setCheckoutOpen(true)
  }

  return (
    <main className="canteen-shell">
      <aside className="sidebar">
        <a className="brand" href="#home" aria-label="Greenhouse Canteen home">
          <span className="brand-mark"><Leaf size={20} strokeWidth={2.2} /></span>
          <span>greenhouse<span className="brand-sub">CAMPUS CANTEEN</span></span>
        </a>
        <div className="sidebar-label">YOUR SPACE</div>
        <nav className="side-nav" aria-label="Main navigation">
          <a className="nav-link active" href="#menu"><Utensils size={18} /> Menu <span className="nav-dot" /></a>
          <a className="nav-link" href="#orders" onClick={(event) => { event.preventDefault(); setOrderOpen(true) }}><ShoppingBag size={18} /> My orders</a>
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-note"><Sparkles size={16} /><span>Good food, less waiting.<br /><strong>That&apos;s the idea.</strong></span></div>
          <div className="profile"><div className="avatar">{user ? user.name.slice(0, 2).toUpperCase() : 'G'}</div><div><strong>{user?.name ?? 'Guest'}</strong><span>{user ? 'Student account' : 'Browsing as guest'}</span></div>{user ? <button aria-label="Sign out" title="Sign out" className="icon-button" onClick={async () => { await authClient.signOut(); router.refresh() }}><ChevronDown size={16} /></button> : <a aria-label="Sign in" title="Sign in" className="icon-button" href="/sign-in"><ChevronDown size={16} /></a>}</div>
        </div>
      </aside>

      <section className="main-column" id="home">
        <header className="topbar">
          <div className="campus-switch"><span className="campus-indicator" /> North Campus <ChevronDown size={15} /></div>
          <div className="topbar-actions"><span className="open-status"><span /> OPEN UNTIL 4 PM</span><button className="icon-button notification" aria-label="Notifications"><Bell size={18} /><i /></button>{user ? <button className="account-link" onClick={async () => { await authClient.signOut(); router.refresh() }}>Sign out</button> : <a className="account-link" href="/sign-in">Sign in</a>}<button className="mobile-cart" onClick={openCheckout} aria-label={`Open order, ${itemCount} items`}><ShoppingBag size={18} />{itemCount > 0 && <span>{itemCount}</span>}</button></div>
        </header>

        <div className="content-area">
          <section className="welcome-row">
            <div><p className="eyebrow">FRIDAY, NOVEMBER 20, 2026 <span className="sun-mark">✳</span></p><h1>Hey {user?.name.split(' ')[0] ?? 'there'}, <span>what sounds good?</span></h1><p className="welcome-copy">A better lunch break is just a few taps away.</p></div>
            <div className="today-stats"><div className="stat-icon"><Clock3 size={17} /></div><div><span>Current wait</span><strong>~{averageWaitMinutes} <small>min</small></strong></div><ArrowDownRight className="stat-trend" size={16} /></div>
          </section>

          <section className="feature-card">
            <div className="feature-copy"><span className="feature-label"><Sparkles size={14} /> TODAY&apos;S PICK</span><h2>Fresh, feel-good<br />fuel for your day.</h2><p>Meet the Green Goddess bowl — bright, crunchy, and made fresh when you order.</p><button className="feature-button" onClick={() => changeQuantity('green-goddess-bowl', 1)}>Add the bowl <ArrowRight size={16} /></button><span className="feature-price">{formatRupees(249)} <span>· 12 min prep</span></span></div>
            <div className="feature-image"><Image src="/images/canteen-hero.png" alt="Fresh grain bowl with colorful vegetables, avocado, greens, and chickpeas" fill priority sizes="(max-width: 700px) 90vw, 44vw" /></div>
            <span className="feature-sticker">MADE<br />FRESH<br /><b>FOR YOU</b></span>
          </section>

          <section className="recommendations" aria-labelledby="recommendations-title">
            <div className="recommendations-heading">
              <div><p className="eyebrow">A LITTLE INSPIRATION</p><h2 id="recommendations-title">Recommended for you</h2><p>Campus favourites for whatever your day calls for.</p></div>
              <a href="#menu">Browse all dishes <ArrowRight size={14} /></a>
            </div>
            <div className="recommendation-grid">
              {recommendedItems.map((item) => <article className="recommendation-card" key={item.id}>
                <div className={`recommendation-art ${item.tone}`}><ItemIcon type={item.icon} /></div>
                <div className="recommendation-details"><span>{item.tag ?? item.mealPeriod}</span><h3>{item.name}</h3><p>{item.detail}</p><div><strong>{formatRupees(item.price)}</strong><button className="add-button" onClick={() => changeQuantity(item.id, 1)} aria-label={`Add ${item.name} to order`} disabled={itemCount >= MAX_CART_QUANTITY || (cart[item.id] ?? 0) >= MAX_ITEM_QUANTITY}><Plus size={17} /></button></div></div>
              </article>)}
            </div>
          </section>

          <section className="menu-section" id="menu">
            <div className="section-heading"><div><p className="eyebrow">THE GOOD STUFF</p><h2>Today&apos;s menu <span className="menu-count">{visibleItems.length}</span></h2></div><label className="search-box"><Search size={17} /><span className="sr-only">Search menu</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find your favorite..." /></label></div>
            <div className="meal-period-row" role="tablist" aria-label="Filter menu by meal period">{MENU_MEAL_PERIODS.map((item) => <button key={item} role="tab" aria-selected={mealPeriod === item} className={`meal-period-chip${mealPeriod === item ? ' selected' : ''}`} onClick={() => setMealPeriod(item)}>{item === 'Everything' ? 'All day' : item}</button>)}</div>
            <div className="category-row" role="tablist" aria-label="Filter menu by category">{MENU_CATEGORIES.map((item) => <button key={item} role="tab" aria-selected={category === item} className={`category-chip${category === item ? ' selected' : ''}`} onClick={() => setCategory(item)}>{item}</button>)}</div>
            <div className="menu-grid">{visibleItems.map((item) => <article className="menu-card" key={item.id}><div className={`dish-art ${item.tone}`}><span className="dish-icon"><ItemIcon type={item.icon} /></span>{item.tag && <span className="dish-tag">{item.tag}</span>}<div className="dish-orbit" /></div><div className="dish-details"><div className="dish-title-row"><h3>{item.name}</h3><strong>{formatRupees(item.price)}</strong></div><p>{item.detail}</p><div className="dish-footer"><span><Clock3 size={13} /> 8–12 min</span><button className="add-button" onClick={() => changeQuantity(item.id, 1)} aria-label={`Add ${item.name} to order`} disabled={itemCount >= MAX_CART_QUANTITY || (cart[item.id] ?? 0) >= MAX_ITEM_QUANTITY}><Plus size={17} /></button></div></div></article>)}</div>
            {visibleItems.length === 0 && <div className="no-results"><Search size={20} /><strong>No dishes found</strong><span>Try a different search or category.</span></div>}
          </section>
          <footer className="page-footer"><span>Made with care at North Campus.</span><span>Questions? Find us at the counter <ArrowRight size={13} /></span></footer>
        </div>
      </section>

      <aside className="order-sidebar" id="orders">
        <div className="order-head"><div><span className="eyebrow">YOUR BREAK, YOUR WAY</span><h2>Your order <span>{itemCount}</span></h2></div><button className="order-history" onClick={() => setOrderOpen(true)}>History <ArrowRight size={14} /></button></div>
        <div className="order-eta"><span className="eta-icon"><Clock3 size={16} /></span><span>Pickup average <strong>~{averageWaitMinutes} min</strong></span><span className="eta-divider" /> <span className="eta-open">Kitchen open</span></div>
        {cartItems.length ? <div className="cart-list">{cartItems.map((item) => <div className="cart-item" key={item.id}><div className={`cart-thumb ${item.tone}`}><ItemIcon type={item.icon} /></div><div className="cart-item-info"><strong>{item.name}</strong><span>{formatRupees(item.price)}</span><div className="quantity-control"><button aria-label={`Remove one ${item.name}`} onClick={() => changeQuantity(item.id, -1)}><Minus size={13} /></button><span>{cart[item.id]}</span><button aria-label={`Add one ${item.name}`} onClick={() => changeQuantity(item.id, 1)} disabled={itemCount >= MAX_CART_QUANTITY || cart[item.id] >= MAX_ITEM_QUANTITY}><Plus size={13} /></button></div></div><b className="line-total">{formatRupees(item.price * cart[item.id])}</b></div>)}</div> : <div className="empty-order"><div className="empty-bag"><ShoppingBag size={20} /></div><strong>Your order starts here</strong><span>Pick something delicious<br />from today&apos;s menu.</span></div>}
        <div className="order-bottom"><div className="subtotal-row"><span>Subtotal</span><strong>{formatRupees(subtotal)}</strong></div><div className="pickup-note"><span className="pickup-check"><ShieldCheck size={13} /></span><span>Secure online payment <small>· INR</small></span></div><button ref={checkoutButtonRef} className="checkout-button" disabled={!itemCount} onClick={openCheckout}>{itemCount ? <>{user ? 'Continue to payment' : 'Sign in to order'} <span>{formatRupees(subtotal)} <ArrowRight size={15} /></span></> : <>Add items to continue <ArrowRight size={16} /></>}</button><p className="order-footnote">Kitchen ticketing is not connected in this preview.</p></div>
      </aside>

      {checkoutOpen && <CheckoutModal items={cartItems.map((item) => ({ id: item.id, name: item.name, quantity: cart[item.id], price: item.price }))} total={subtotal} idempotencyKey={checkoutKey} onClose={() => { setCheckoutOpen(false); checkoutButtonRef.current?.focus() }} />}
      {orderOpen && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setOrderOpen(false) }}><section className="history-modal" role="dialog" aria-modal="true" aria-labelledby="history-title"><button className="modal-close" onClick={() => setOrderOpen(false)} aria-label="Close dialog"><X size={18} /></button><span className="eyebrow">YOUR CAMPUS ORDERS</span><h2 id="history-title">Order history</h2>{orders.length ? <><div className="history-average"><Clock3 size={16} /><span>Your average estimated wait</span><strong>~{averageWaitMinutes} min</strong></div><div className="history-list">{orders.map((order) => <article className="history-row" key={order.id}><div className="history-icon"><ShoppingBag size={16} /></div><div className="history-details"><strong>Order ID · {order.id}</strong><span>{new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(order.createdAt))}</span><span>{order.items.map((item) => `${item.quantity}× ${item.name}`).join(' · ')}</span><span>Estimated wait · ~{order.waitEstimateMinutes} min</span></div><b className="history-total">{formatRupees(order.amountTotal / 100)}</b></article>)}</div></> : <div className="history-empty">Your paid orders, unique order IDs, and estimated wait times will appear here.</div>}<button className="modal-done" onClick={() => setOrderOpen(false)}>Back to menu</button></section></div>}
    </main>
  )
}
