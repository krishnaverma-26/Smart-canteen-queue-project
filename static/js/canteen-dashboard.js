(() => {
  const cards = [...document.querySelectorAll('[data-menu-card]')];
  const cart = new Map();
  const money = (value) => `₹${Number(value).toFixed(2)}`;
  const cartList = document.getElementById('cart-list');
  const emptyCart = document.getElementById('empty-cart');
  const countLabel = document.getElementById('cart-count');
  const mobileCount = document.getElementById('mobile-count');
  const subtotalLabel = document.getElementById('cart-subtotal');
  const checkoutTotal = document.getElementById('checkout-total');
  const checkoutButton = document.getElementById('checkout-button');
  const checkoutLabel = document.getElementById('checkout-label');
  const payload = document.getElementById('cart-payload');

  function updateCart() {
    let count = 0;
    let total = 0;
    cartList.replaceChildren();
    for (const [id, entry] of cart) {
      count += entry.quantity;
      total += entry.price * entry.quantity;
      const row = document.createElement('div');
      row.className = 'cart-item';
      const info = document.createElement('div'); info.className = 'cart-item-info';
      const name = document.createElement('strong'); name.textContent = entry.name;
      const price = document.createElement('span'); price.textContent = money(entry.price);
      const controls = document.createElement('div'); controls.className = 'quantity-control';
      const minus = document.createElement('button'); minus.type = 'button'; minus.textContent = '−'; minus.setAttribute('aria-label', `Remove one ${entry.name}`); minus.addEventListener('click', () => changeQuantity(id, -1));
      const quantity = document.createElement('span'); quantity.textContent = entry.quantity;
      const plus = document.createElement('button'); plus.type = 'button'; plus.textContent = '+'; plus.setAttribute('aria-label', `Add one ${entry.name}`); plus.addEventListener('click', () => changeQuantity(id, 1));
      controls.append(minus, quantity, plus); info.append(name, price, controls);
      const lineTotal = document.createElement('b'); lineTotal.className = 'line-total'; lineTotal.textContent = money(entry.price * entry.quantity);
      row.append(info, lineTotal); cartList.append(row);
    }
    countLabel.textContent = count; mobileCount.textContent = count;
    subtotalLabel.textContent = money(total); checkoutTotal.textContent = count ? money(total) : '→';
    checkoutLabel.textContent = count ? 'Place order' : 'Add items to continue';
    checkoutButton.disabled = count === 0;
    emptyCart.hidden = count > 0;
    payload.value = JSON.stringify(Object.fromEntries([...cart].map(([id, entry]) => [id, entry.quantity])));
  }

  function changeQuantity(id, delta) {
    const card = cards.find((element) => element.dataset.id === String(id));
    if (!card || card.dataset.available !== '1') return;
    const current = cart.get(String(id));
    const next = (current?.quantity || 0) + delta;
    if (next <= 0) cart.delete(String(id));
    else cart.set(String(id), { name: card.querySelector('h3').textContent, price: Number(card.dataset.price), quantity: Math.min(next, 50) });
    updateCart();
  }

  document.querySelectorAll('[data-add], [data-feature-add]').forEach((button) => button.addEventListener('click', () => changeQuantity(button.dataset.add || button.dataset.featureAdd, 1)));
  document.querySelectorAll('[data-category]').forEach((button) => button.addEventListener('click', () => {
    document.querySelectorAll('[data-category]').forEach((chip) => { const active = chip === button; chip.classList.toggle('selected', active); chip.setAttribute('aria-selected', String(active)); });
    filterCards();
  }));
  const search = document.getElementById('menu-search');
  search.addEventListener('input', filterCards);
  function filterCards() {
    const category = document.querySelector('[data-category].selected')?.dataset.category || 'all';
    const term = search.value.trim().toLowerCase();
    let visible = 0;
    cards.forEach((card) => {
      const categoryMatch = category === 'all' || card.dataset.category === category;
      const searchMatch = card.dataset.name.includes(term);
      const show = categoryMatch && searchMatch;
      card.hidden = !show;
      if (show) visible++;
    });
    document.getElementById('visible-count').textContent = visible;
    document.getElementById('search-empty').hidden = visible !== 0;
  }

  const modal = document.getElementById('history-modal');
  const openModal = () => { modal.hidden = false; document.getElementById('close-history').focus(); };
  const closeModal = () => { modal.hidden = true; };
  document.getElementById('open-history').addEventListener('click', openModal);
  document.getElementById('history-link').addEventListener('click', (event) => { event.preventDefault(); openModal(); });
  document.getElementById('close-history').addEventListener('click', closeModal);
  document.getElementById('done-history').addEventListener('click', closeModal);
  modal.addEventListener('click', (event) => { if (event.target === modal) closeModal(); });
  const mobileCartButton = document.getElementById('mobile-cart');
  const orderSidebar = document.getElementById('orders');
  mobileCartButton.addEventListener('click', () => {
    const isOpen = orderSidebar.classList.toggle('mobile-open');
    mobileCartButton.setAttribute('aria-expanded', String(isOpen));
  });
  document.getElementById('mobile-order-close').addEventListener('click', () => {
    orderSidebar.classList.remove('mobile-open');
    mobileCartButton.setAttribute('aria-expanded', 'false');
  });
  document.getElementById('checkout-form').addEventListener('submit', (event) => { if (cart.size === 0) event.preventDefault(); });
  updateCart();
})();
