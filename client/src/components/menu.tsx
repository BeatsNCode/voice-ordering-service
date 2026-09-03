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
      <h1 style={{ paddingTop: '20px', paddingBottom: '10px' }}>Voice Ordering Service</h1>
      <Microphone />
      {menu.map((item, index) => (
        <div style={{ paddingTop: '5px' }} key={index} className="menu-item">
          <h2>{item.name}</h2>
          <p>Price: ${item.price}</p>
        </div>
      ))}
    </>
  )
}

export default Menu