import { useEffect, useState } from 'react'
import Microphone from './microphone'

type MenuItem = {
  name: string
  price: number
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

  return (
    <>
      <h1 style={{ paddingTop: '20px', paddingBottom: '30px' }}>Voice Ordering Service</h1>
      <h2 style={{ paddingBottom: '10px' }}>Menu</h2>
      <Microphone />
      {menu.map((item, index) => (
        <div style={{ paddingTop: '5px', border: '1px solid #3a3c45', margin: '30px 0' }} key={index} className="menu-item">
          <h4>{item.name}</h4>
          <p>${item.price}</p>
        </div>
      ))}
    </>
  )
}

export default Menu