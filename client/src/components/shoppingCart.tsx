import { ShoppingCart as ShoppingCartIcon } from 'lucide-react';

type ShoppingCartProps = {
  onClick: () => void
}

const ShoppingCart = ({ onClick }: ShoppingCartProps) => {
  return (
    <button style={{ border: 'none', background: 'none' }} onClick={onClick}>
      <ShoppingCartIcon />
    </button>
  );
};

export default ShoppingCart;