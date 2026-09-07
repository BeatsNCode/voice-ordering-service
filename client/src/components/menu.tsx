import { useEffect, useState } from 'react';
import Microphone from './microphone';
import ShoppingCart from './shoppingCart';

type MenuItem = {
  name: string
  price: number,
  category: string
}

function loadMenu(setMenu: React.Dispatch<React.SetStateAction<MenuItem[]>>) {
  let isMounted = true

  const fetchMenu = async () => {
    try {
      const response = await fetch('/api/')
      const data: MenuItem[] = await response.json()

      if (isMounted) {
        setMenu(data)
        console.log('Menu loaded:', data)
      }
    } catch (error) {
      console.error('Error loading menu:', error)
    }
  }

  void fetchMenu()
  
  return () => {
    isMounted = false
  }

}

function Menu() {
  const [menu, setMenu] = useState<MenuItem[]>([])
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)

  useEffect(() => {
    const cleanup = loadMenu(setMenu)
    return cleanup
  }, [])

  const foodItems = menu.filter(item =>
    ['burger', 'sandwich', 'side'].includes(item.category)
  )

  const drinkItems = menu.filter(item => item.category === 'drink')

  const dessertItems = menu.filter(item => item.category === 'dessert')

  return (
  <>
    <header className="app-header">
      <h1 style={{ margin: 'auto' }}>
        Voice Ordering Service
      </h1>

      <div className="desktop-cart">
        <ShoppingCart onClick={() => setIsCartOpen(true)} />
      </div>

      <button
        className="hamburger-button"
        onClick={() => setIsMenuOpen(prev => !prev)}
        aria-label="Open navigation menu"
        aria-expanded={isMenuOpen}
      >
        ☰
      </button>

      {isMenuOpen && (
        <div className="mobile-menu">
          <ShoppingCart onClick={() => setIsCartOpen(true)} />
        </div>
      )}
    </header>

    {isCartOpen && (
      <aside className="shopping-cart-drawer">
        <button
          className="cart-close-button"
          onClick={() => setIsCartOpen(false)}
          aria-label="Close shopping cart"
        >
          ×
        </button>

        <h2>Your Order</h2>



      </aside>
    )}

    <h2 style={{ paddingTop: '15px', paddingBottom: '5px' }}>
      MENU
    </h2>
    <Microphone />
    
    <div className="menu-layout">
      <div className="menu-left">
        <section className="menu-section">
          <h3>Food</h3>

          {foodItems.map((item, index) => (
            <div key={index} className="menu-item">
              <h4>{item.name}</h4>
              <p>${item.price}</p>
            </div>
          ))}
        </section>
      </div>

      <div className="menu-right">
        <section className="menu-section">
          <h3>Drinks</h3>

          {drinkItems.map((item, index) => (
            <div key={index} className="menu-item">
              <h4>{item.name}</h4>
              <p>${item.price}</p>
            </div>
          ))}
        </section>

        <section className="menu-section">
          <h3>Desserts</h3>

          {dessertItems.map((item, index) => (
            <div key={index} className="menu-item">
              <h4>{item.name}</h4>
              <p>${item.price}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  </>
)
}

export default Menu