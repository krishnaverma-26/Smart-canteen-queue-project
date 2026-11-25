export type MenuItem = {
  id: string
  name: string
  detail: string
  price: number
  category: 'Bowls' | 'Meals' | 'Sandwiches' | 'Snacks' | 'Drinks'
  mealPeriod: 'Breakfast' | 'Lunch' | 'Dinner'
  tag?: string
  tone: 'sage' | 'peach' | 'gold' | 'lavender' | 'rose' | 'mint'
  icon: 'leaf' | 'flame' | 'coffee' | 'utensils'
  prepMinutes?: number
}

export const MENU_ITEMS: MenuItem[] = [
  { id: 'green-goddess-bowl', name: 'Green goddess bowl', detail: 'Avocado · quinoa · crispy chickpeas', price: 249, category: 'Bowls', mealPeriod: 'Lunch', tag: 'Bestseller', tone: 'sage', icon: 'leaf', prepMinutes: 12 },
  { id: 'rajma-rice-bowl', name: 'Rajma rice bowl', detail: 'Slow-cooked kidney beans · jeera rice', price: 169, category: 'Bowls', mealPeriod: 'Lunch', tag: 'Comfort food', tone: 'peach', icon: 'flame' },
  { id: 'spicy-miso-ramen', name: 'Spicy miso ramen', detail: 'Slow broth · soft egg · scallions', price: 289, category: 'Bowls', mealPeriod: 'Dinner', tag: 'Popular', tone: 'gold', icon: 'flame' },
  { id: 'campus-club-sandwich', name: 'Campus club sandwich', detail: 'Sourdough · tomato · herb mayo', price: 189, category: 'Sandwiches', mealPeriod: 'Lunch', tone: 'peach', icon: 'utensils' },
  { id: 'paneer-tikka-roll', name: 'Paneer tikka roll', detail: 'Smoky paneer · mint chutney · roomali roti', price: 179, category: 'Sandwiches', mealPeriod: 'Lunch', tag: 'Student favourite', tone: 'sage', icon: 'flame' },
  { id: 'roasted-tomato-toast', name: 'Roasted tomato toast', detail: 'Whipped ricotta · basil · chili oil', price: 149, category: 'Sandwiches', mealPeriod: 'Breakfast', tone: 'rose', icon: 'utensils' },
  { id: 'masala-dosa', name: 'Masala dosa', detail: 'Golden dosa · potato masala · sambar', price: 139, category: 'Meals', mealPeriod: 'Breakfast', tag: 'Made to order', tone: 'gold', icon: 'utensils' },
  { id: 'chole-kulche', name: 'Chole kulche', detail: 'Amritsari chole · soft kulcha · onion', price: 149, category: 'Meals', mealPeriod: 'Lunch', tone: 'peach', icon: 'flame' },
  { id: 'veg-biryani', name: 'Veg dum biryani', detail: 'Fragrant basmati · raita · fried onions', price: 199, category: 'Meals', mealPeriod: 'Dinner', tone: 'sage', icon: 'leaf' },
  { id: 'hakka-noodles', name: 'Veg hakka noodles', detail: 'Wok-tossed noodles · market vegetables', price: 179, category: 'Meals', mealPeriod: 'Dinner', tone: 'lavender', icon: 'flame' },
  { id: 'samosa-chaat', name: 'Samosa chaat', detail: 'Crispy samosa · chole · sweet yogurt', price: 89, category: 'Snacks', mealPeriod: 'Lunch', tag: 'Quick bite', tone: 'gold', icon: 'utensils' },
  { id: 'masala-fries', name: 'Masala fries', detail: 'Crispy fries · house spice · lime', price: 99, category: 'Snacks', mealPeriod: 'Dinner', tone: 'rose', icon: 'flame' },
  { id: 'iced-oat-latte', name: 'Iced oat latte', detail: 'Double shot · creamy oat milk', price: 129, category: 'Drinks', mealPeriod: 'Breakfast', tone: 'lavender', icon: 'coffee' },
  { id: 'mango-lassi', name: 'Mango lassi', detail: 'Alphonso mango · chilled yogurt', price: 99, category: 'Drinks', mealPeriod: 'Lunch', tag: 'Seasonal', tone: 'gold', icon: 'coffee' },
  { id: 'nimbu-mint-cooler', name: 'Nimbu mint cooler', detail: 'Fresh lime · mint · sparkling water', price: 79, category: 'Drinks', mealPeriod: 'Lunch', tone: 'mint', icon: 'coffee' },
  { id: 'adrak-chai', name: 'Adrak chai', detail: 'Ginger · cardamom · brewed fresh', price: 35, category: 'Drinks', mealPeriod: 'Breakfast', tone: 'peach', icon: 'coffee' },
  { id: 'kanda-poha', name: 'Kanda poha', detail: 'Flattened rice · peanuts · curry leaves', price: 79, category: 'Meals', mealPeriod: 'Breakfast', tag: 'Morning favourite', tone: 'gold', icon: 'leaf' },
  { id: 'idli-sambar', name: 'Idli sambar', detail: 'Steamed rice cakes · lentil stew · chutney', price: 89, category: 'Meals', mealPeriod: 'Breakfast', tone: 'sage', icon: 'utensils' },
  { id: 'vegetable-upma', name: 'Garden vegetable upma', detail: 'Semolina · seasonal vegetables · cashews', price: 85, category: 'Meals', mealPeriod: 'Breakfast', tone: 'peach', icon: 'leaf' },
  { id: 'paneer-paratha', name: 'Paneer paratha', detail: 'Spiced cottage cheese · yogurt · pickle', price: 119, category: 'Meals', mealPeriod: 'Breakfast', tone: 'gold', icon: 'flame' },
  { id: 'moong-dal-chilla', name: 'Moong dal chilla', detail: 'Savory lentil pancake · coriander chutney', price: 99, category: 'Meals', mealPeriod: 'Breakfast', tone: 'mint', icon: 'leaf' },
  { id: 'banana-oat-bowl', name: 'Banana oat bowl', detail: 'Warm oats · banana · toasted almonds', price: 109, category: 'Bowls', mealPeriod: 'Breakfast', tone: 'peach', icon: 'leaf' },
  { id: 'berry-yogurt-parfait', name: 'Berry yogurt parfait', detail: 'Greek yogurt · berries · house granola', price: 139, category: 'Bowls', mealPeriod: 'Breakfast', tag: 'Fresh pick', tone: 'rose', icon: 'leaf' },
  { id: 'breakfast-burrito', name: 'Sunrise breakfast burrito', detail: 'Scrambled egg · beans · salsa · cheddar', price: 159, category: 'Sandwiches', mealPeriod: 'Breakfast', tone: 'gold', icon: 'flame' },
  { id: 'blueberry-pancakes', name: 'Blueberry pancakes', detail: 'Buttermilk stack · berries · maple syrup', price: 169, category: 'Meals', mealPeriod: 'Breakfast', tone: 'lavender', icon: 'utensils' },
  { id: 'peanut-butter-toast', name: 'Peanut butter banana toast', detail: 'Multigrain toast · banana · chia', price: 99, category: 'Sandwiches', mealPeriod: 'Breakfast', tone: 'peach', icon: 'leaf' },
  { id: 'filter-kaapi', name: 'South Indian filter kaapi', detail: 'Fresh decoction · steamed milk · jaggery', price: 59, category: 'Drinks', mealPeriod: 'Breakfast', tone: 'peach', icon: 'coffee' },
  { id: 'cinnamon-cold-brew', name: 'Cinnamon cold brew', detail: 'Slow-steeped coffee · cinnamon · oat milk', price: 119, category: 'Drinks', mealPeriod: 'Breakfast', tone: 'lavender', icon: 'coffee' },
  { id: 'palak-paneer-rice', name: 'Palak paneer rice bowl', detail: 'Creamy spinach · paneer · steamed basmati', price: 189, category: 'Bowls', mealPeriod: 'Lunch', tone: 'sage', icon: 'leaf' },
  { id: 'dal-makhani-rice', name: 'Dal makhani rice bowl', detail: 'Slow-simmered black lentils · jeera rice', price: 179, category: 'Bowls', mealPeriod: 'Lunch', tag: 'Comfort food', tone: 'peach', icon: 'flame' },
  { id: 'lemon-rice-bowl', name: 'Lemon rice bowl', detail: 'Tempered rice · peanuts · crunchy papad', price: 129, category: 'Bowls', mealPeriod: 'Lunch', tone: 'gold', icon: 'leaf' },
  { id: 'falafel-grain-bowl', name: 'Falafel grain bowl', detail: 'Herbed falafel · hummus · pickled onion', price: 219, category: 'Bowls', mealPeriod: 'Lunch', tone: 'mint', icon: 'leaf' },
  { id: 'thai-green-curry', name: 'Thai green curry rice', detail: 'Coconut curry · tofu · garden vegetables', price: 219, category: 'Meals', mealPeriod: 'Lunch', tone: 'sage', icon: 'flame' },
  { id: 'pesto-penne', name: 'Basil pesto penne', detail: 'Basil pesto · roasted tomato · parmesan', price: 199, category: 'Meals', mealPeriod: 'Lunch', tone: 'mint', icon: 'leaf' },
  { id: 'grilled-cheese-tomato', name: 'Grilled cheese & tomato soup', detail: 'Toasted sourdough · cheddar · basil soup', price: 189, category: 'Sandwiches', mealPeriod: 'Lunch', tone: 'peach', icon: 'utensils' },
  { id: 'spinach-corn-sandwich', name: 'Spinach corn melt', detail: 'Creamed spinach · sweet corn · multigrain', price: 159, category: 'Sandwiches', mealPeriod: 'Lunch', tone: 'sage', icon: 'utensils' },
  { id: 'burrito-rice-bowl', name: 'Smoky burrito bowl', detail: 'Black beans · corn salsa · cilantro rice', price: 209, category: 'Bowls', mealPeriod: 'Lunch', tone: 'gold', icon: 'flame' },
  { id: 'quinoa-crunch-salad', name: 'Quinoa crunch salad', detail: 'Quinoa · cucumber · seeds · lemon dressing', price: 199, category: 'Bowls', mealPeriod: 'Lunch', tone: 'mint', icon: 'leaf' },
  { id: 'campus-veg-thali', name: 'Campus veg thali', detail: 'Two curries · dal · roti · rice · pickle', price: 229, category: 'Meals', mealPeriod: 'Lunch', tag: 'Full meal', tone: 'gold', icon: 'utensils' },
  { id: 'curd-rice-bowl', name: 'Cooling curd rice', detail: 'Yogurt rice · pomegranate · tempered spices', price: 119, category: 'Bowls', mealPeriod: 'Lunch', tone: 'rose', icon: 'leaf' },
  { id: 'chana-kachumber', name: 'Chana kachumber cup', detail: 'Chickpeas · cucumber · tomato · lime', price: 109, category: 'Snacks', mealPeriod: 'Lunch', tone: 'mint', icon: 'leaf' },
  { id: 'mushroom-rice-bowl', name: 'Roasted mushroom bowl', detail: 'Garlic mushrooms · brown rice · greens', price: 219, category: 'Bowls', mealPeriod: 'Lunch', tone: 'lavender', icon: 'leaf' },
  { id: 'veg-momos', name: 'Steamed veg momos', detail: 'Six dumplings · ginger soy dip · chili oil', price: 129, category: 'Snacks', mealPeriod: 'Lunch', tone: 'rose', icon: 'utensils' },
  { id: 'corn-chaat', name: 'Masala corn chaat', detail: 'Sweet corn · lime · coriander · chaat masala', price: 69, category: 'Snacks', mealPeriod: 'Lunch', tone: 'gold', icon: 'flame' },
  { id: 'rose-lassi', name: 'Rose cardamom lassi', detail: 'Chilled yogurt · rose · crushed pistachio', price: 99, category: 'Drinks', mealPeriod: 'Lunch', tone: 'rose', icon: 'coffee' },
  { id: 'paneer-butter-masala', name: 'Paneer butter masala', detail: 'Tomato cream gravy · paneer · butter naan', price: 239, category: 'Meals', mealPeriod: 'Dinner', tag: 'House special', tone: 'peach', icon: 'flame' },
  { id: 'dal-tadka-jeera-rice', name: 'Dal tadka & jeera rice', detail: 'Yellow lentils · cumin rice · crisp papad', price: 169, category: 'Meals', mealPeriod: 'Dinner', tone: 'gold', icon: 'leaf' },
  { id: 'soya-chaap-roll', name: 'Tandoori soya chaap roll', detail: 'Smoky chaap · onion · green chutney', price: 189, category: 'Sandwiches', mealPeriod: 'Dinner', tone: 'rose', icon: 'flame' },
  { id: 'tofu-teriyaki-bowl', name: 'Tofu teriyaki bowl', detail: 'Sesame tofu · sticky rice · crisp greens', price: 229, category: 'Bowls', mealPeriod: 'Dinner', tone: 'sage', icon: 'leaf' },
  { id: 'chilli-garlic-noodles', name: 'Chilli garlic noodles', detail: 'Wok-tossed noodles · garlic · spring onion', price: 189, category: 'Meals', mealPeriod: 'Dinner', tone: 'rose', icon: 'flame' },
  { id: 'baked-mac-cheese', name: 'Baked mac & cheese', detail: 'Creamy cheddar · golden crumb · herbs', price: 199, category: 'Meals', mealPeriod: 'Dinner', tone: 'gold', icon: 'utensils' },
  { id: 'vegetable-lasagna', name: 'Roasted vegetable lasagna', detail: 'Layered pasta · garden vegetables · mozzarella', price: 229, category: 'Meals', mealPeriod: 'Dinner', tone: 'peach', icon: 'utensils' },
  { id: 'paneer-tikka-platter', name: 'Paneer tikka platter', detail: 'Charred paneer · mint dip · roomali roti', price: 249, category: 'Meals', mealPeriod: 'Dinner', tone: 'sage', icon: 'flame' },
  { id: 'kadai-vegetable-curry', name: 'Kadai vegetable curry', detail: 'Bell peppers · paneer · soft butter naan', price: 219, category: 'Meals', mealPeriod: 'Dinner', tone: 'lavender', icon: 'flame' },
  { id: 'moong-dal-khichdi', name: 'Moong dal khichdi', detail: 'Rice & lentils · ghee · cooling yogurt', price: 149, category: 'Bowls', mealPeriod: 'Dinner', tag: 'Feel-good bowl', tone: 'gold', icon: 'leaf' },
  { id: 'lemon-herb-pasta', name: 'Lemon herb pasta', detail: 'Creamy lemon sauce · parsley · parmesan', price: 209, category: 'Meals', mealPeriod: 'Dinner', tone: 'mint', icon: 'leaf' },
  { id: 'mushroom-masala-bowl', name: 'Mushroom masala bowl', detail: 'Peppery mushroom curry · basmati · greens', price: 199, category: 'Bowls', mealPeriod: 'Dinner', tone: 'lavender', icon: 'flame' },
  { id: 'tomato-soup-toastie', name: 'Tomato soup & toastie', detail: 'Slow-roasted tomato · crisp cheese sandwich', price: 159, category: 'Sandwiches', mealPeriod: 'Dinner', tone: 'rose', icon: 'utensils' },
  { id: 'garden-dinner-thali', name: 'Garden dinner thali', detail: 'Seasonal curry · dal · roti · rice · dessert', price: 249, category: 'Meals', mealPeriod: 'Dinner', tag: 'Complete dinner', tone: 'sage', icon: 'utensils' },
  { id: 'sweet-potato-fries', name: 'Sweet potato fries', detail: 'Oven-crisp fries · smoked paprika dip', price: 119, category: 'Snacks', mealPeriod: 'Dinner', tone: 'peach', icon: 'flame' },
  { id: 'dark-chocolate-brownie', name: 'Dark chocolate brownie', detail: 'Fudgy cocoa · toasted walnuts · sea salt', price: 89, category: 'Snacks', mealPeriod: 'Dinner', tone: 'lavender', icon: 'utensils' },
  { id: 'warm-turmeric-milk', name: 'Warm turmeric milk', detail: 'Golden milk · honey · cracked black pepper', price: 69, category: 'Drinks', mealPeriod: 'Dinner', tone: 'gold', icon: 'coffee' },
  { id: 'spinach-feta-omelette', name: 'Spinach feta omelette', detail: 'Free-range eggs · baby spinach · feta', price: 149, category: 'Meals', mealPeriod: 'Breakfast', tone: 'mint', icon: 'utensils' },
  { id: 'chocolate-chip-cookie', name: 'Warm chocolate chip cookie', detail: 'Soft-baked cookie · dark chocolate chunks', price: 59, category: 'Snacks', mealPeriod: 'Lunch', tone: 'peach', icon: 'utensils' },
  { id: 'vegetable-pulao', name: 'Vegetable pulao', detail: 'Fragrant basmati · garden vegetables · raita', price: 169, category: 'Meals', mealPeriod: 'Dinner', tone: 'sage', icon: 'leaf' },
  { id: 'mango-banana-smoothie', name: 'Mango banana smoothie', detail: 'Alphonso mango · banana · chilled yogurt', price: 119, category: 'Drinks', mealPeriod: 'Breakfast', tone: 'gold', icon: 'coffee' },
]

export const MENU_CATEGORIES = ['Everything', 'Bowls', 'Meals', 'Sandwiches', 'Snacks', 'Drinks'] as const
export const MENU_MEAL_PERIODS = ['Everything', 'Breakfast', 'Lunch', 'Dinner'] as const
export const RECOMMENDED_ITEM_IDS = ['berry-yogurt-parfait', 'green-goddess-bowl', 'campus-veg-thali', 'paneer-butter-masala'] as const
export const MAX_ITEM_QUANTITY = 5
export const MAX_CART_QUANTITY = 12

export function estimateOrderWaitMinutes(items: { quantity: number }[]) {
  const itemCount = items.reduce((total, item) => total + item.quantity, 0)
  return Math.min(30, 6 + itemCount * 2)
}

export function parseCartQuery(value?: string) {
  const cart: Record<string, number> = {}
  if (!value || value.length > 256) return cart

  let totalQuantity = 0
  for (const entry of value.split(',')) {
    const [id, quantityValue, ...rest] = entry.split(':')
    const quantity = Number(quantityValue)
    if (
      rest.length > 0
      || !MENU_ITEMS.some((item) => item.id === id)
      || !Number.isInteger(quantity)
      || quantity < 1
      || quantity > MAX_ITEM_QUANTITY
      || cart[id]
    ) return {}

    cart[id] = quantity
    totalQuantity += quantity
    if (totalQuantity > MAX_CART_QUANTITY) return {}
  }

  return cart
}

export const formatRupees = (amount: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
