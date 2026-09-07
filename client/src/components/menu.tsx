import { useEffect, useState } from 'react';
import Microphone from './microphone';
import ShoppingCart from './shoppingCart';
import type { OrderResult } from '../types/order';
import { playSpeech } from './playSpeech'

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
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [order, setOrder] = useState<OrderResult | null>(null)

  useEffect(() => {
    const cleanup = loadMenu(setMenu)
    return cleanup
  }, [])

  const foodItems = menu.filter(item =>
    ['burger', 'sandwich', 'side'].includes(item.category)
  )

  const drinkItems = menu.filter(item => item.category === 'drink')

  const dessertItems = menu.filter(item => item.category === 'dessert')

  const orderTotal = order?.availableItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  ) ?? 0

  const handleOrderReceived = async (result: OrderResult) => {
    setOrder(result)

    await playSpeech('Your order has been added to the cart.')
  }


  return (
  <>
    <header className="app-header">
      <h1 style={{ margin: 'auto' }}>
        Voice Ordering Service
      </h1>

      <ShoppingCart onClick={() => setIsCartOpen(true)} />

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

        {order?.availableItems.map((item) => (
          <div key={item.item_id} className="cart-item">
            <div className="cart-item-main">
              <h4>{item.name}</h4>

              {item.quantity > 1 && (
              <p className="cart-item-price">
                ${item.price} (x{item.quantity})
              </p>
              )}
              {item.quantity === 1 && (
              <p className="cart-item-price">
                ${item.price}
              </p>
              )}

            </div>
            <div className="cart-item-details">
              <span>Qty {item.quantity}</span>
            </div>
      
          </div>
        ))}
        {order && order.availableItems.length > 0 && (
          <div className="cart-total">
            <span style={{ fontWeight: 'bold' }}>Total</span>
            <strong>${orderTotal.toFixed(2)}</strong>
          </div>
        )}

      </aside>
    )}

    <h2 style={{ paddingTop: '15px', paddingBottom: '5px' }}>
      Menu
    </h2>
    <Microphone onOrderReceived={handleOrderReceived} />
    
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