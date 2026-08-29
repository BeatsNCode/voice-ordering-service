import { useEffect, useState } from 'react'

function App() {

  const [menu, setMenu] = useState([]);

  const loadMenu = async () => {
    try {
      const response = await fetch('/api/');
      const data = await response.json();
      setMenu(data);
      console.log('Menu loaded:', data);
    } catch (error) {
      console.error('Error loading menu:', error);
    }
  }
  
  useEffect(() => {
    loadMenu();
  }, []);
  
  return (
    <>
      <h1>Voice Ordering Service</h1>
      
    </>
  )
}

export default App
