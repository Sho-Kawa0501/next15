import { Cart } from "@/types"
import useSWR from "swr"

const fetcher = async (url: string) => {
    const response = await fetch(url)
    if(!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error)
    }

    const data = await response.json()
    return data
  }

export function useCart(restaurantId?: string, enabled = true) {
  const { 
    data: carts,
    error: cartsError,
    isLoading,
    mutate: mutateCart
  } = useSWR<Cart[]>(`/api/cart`, fetcher, {
    isPaused: () => !enabled
  })

  const targetCart = restaurantId 
    ? carts?.find((cart) => cart.restaurant_id === restaurantId) ?? null 
    : null
  // console.log("targetCart",targetCart)
  return {carts, cartsError, isLoading, mutateCart, targetCart}
}