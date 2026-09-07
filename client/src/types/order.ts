export type OrderItem = {
  item_id: string
  name: string
  price: number
  quantity: number
  available: boolean
}

export type InvalidItem = {
  item_id: null
  requested_name: string
  quantity: number
}

export type OrderResult = {
  transcript: string
  availableItems: OrderItem[]
  unavailableItems: OrderItem[]
  invalidItems: InvalidItem[]
}