import { useEffect, useState } from 'react'
import Microphone from './microphone'

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
    <h1 style={{ paddingTop: '20px', paddingBottom: '20px' }}>Voice Ordering Service</h1>
    <h2 style={{ paddingTop: '10px', paddingBottom: '5px' }}>Menu</h2>
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