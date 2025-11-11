"use client"
import { useCart } from '@/hooks/cart/useCart'
import React from 'react'

const Cart = () => {
  const { carts } = useCart()
  console.log("ccaarrttss", carts)
  return ( 
    <div>Cart</div>
  )
}

export default Cart