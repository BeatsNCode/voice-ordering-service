export type OrderItem = {
  item_id: string
  name: string
  price: number
  quantity: number
  available: boolean
}

export type InvalidItem = {
  item_id: null
  name: string
  quantity: number
}

export type OrderResult = {
  transcript: string
  availableItems: OrderItem[]
  unavailableItems: OrderItem[]
  invalidItems: InvalidItem[]
}

export const calculateOrderTotal = (result: OrderResult) => {
    return Math.round(result.availableItems.reduce(
        (total, item) => total + item.price * item.quantity, 0) * 100) / 100;
}