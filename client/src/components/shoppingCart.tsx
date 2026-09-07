import { ShoppingCart as ShoppingCartIcon } from 'lucide-react';

type ShoppingCartProps = {
    onClick: () => void
    hasUpdate: boolean
}

function ShoppingCart({ onClick, hasUpdate }: ShoppingCartProps) {
  return (
    <button
      className="shopping-cart-button"
      onClick={onClick}
    >
      <ShoppingCartIcon />

      {hasUpdate && (
        <span className="cart-update-dot" />
      )}
    </button>
  )
}

export default ShoppingCart;