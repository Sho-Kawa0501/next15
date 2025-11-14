"use client"
import { useCart } from '@/hooks/cart/useCart'
import { computeCartDisplayLogic } from '@/lib/cart/utils'
import React, { useEffect, useState } from 'react'
import CartSheet from './cart-sheet'
import CartDropDown from './cart-drop-down'
import type { Cart } from '@/types'
import { useCartVisibility } from '@/app/context/cartContext'
import { useParams } from 'next/navigation'

const Cart = () => {
  const [selectedCart, setSelectedCart] = useState<Cart | null>(null)
  const { isOpen, openCart, closeCart } = useCartVisibility()
  const { restaurantId } = useParams<{restaurantId?: string}>()
  const { carts, isLoading, cartsError, targetCart, mutateCart } = useCart(restaurantId)
  const { displayMode, sheetCart, cartCount } = computeCartDisplayLogic(
    carts,
    selectedCart,
    targetCart)

  useEffect(() => {
    if(!carts || !selectedCart) return
    const updateCart = carts.find((cart) => cart.id === selectedCart.id) ?? null
    setSelectedCart(updateCart)
  }, [carts])

  useEffect(() => {
    if(isOpen) return
    setTimeout(() => setSelectedCart(null), 200)
  }, [isOpen])

  if(cartsError) {
    return <div>{cartsError.message}</div>
  }

  if(isLoading || !carts) {
    return <div>isLoading...</div>
  }

  return displayMode === "cartSheet" ? (
    <CartSheet 
      cart={sheetCart} 
      count={cartCount} 
      isOpen={isOpen} 
      openCart={openCart} 
      closeCart={closeCart} 
      mutateCart={mutateCart}
      />
  ) : (
    <CartDropDown 
      carts={carts} 
      setSelectedCart={setSelectedCart} 
      openCart={openCart} />
  )
    
  
}

export default Cart