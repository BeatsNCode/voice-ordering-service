import { useEffect, useState } from 'react'

type MenuItem = {
  name: string
  description: string
  price: number
}

function App() {
  const [menu, setMenu] = useState<MenuItem[]>([])

  useEffect(() => {
    let isMounted = true

    const loadMenu = async () => {
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

    // void loadMenu()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <>
      <h1 style={{ paddingTop: '20px', paddingBottom: '10px' }}>Voice Ordering Service</h1>

      {menu.map((item, index) => (
        <div style={{ paddingTop: '5px' }} key={index} className="menu-item">
          <h2>{item.name}</h2>
          <p>{item.description}</p>
          <p>Price: ${item.price}</p>
        </div>
      ))}
    </>
  )
}

export default App
