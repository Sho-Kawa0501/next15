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
  // 選択したカート管理
  const [selectedCart, setSelectedCart] = useState<Cart | null>(null)
  // カートモーダルの開閉状態管理
  const { isOpen, openCart, closeCart } = useCartVisibility()
  // URLクエリパラメータの値取得
  const { restaurantId } = useParams<{restaurantId?: string}>()
  // カート情報取得hook
  const { carts, isLoading, cartsError, targetCart, mutateCart } = useCart(restaurantId)
  // カートの状態によってカートモーダルの表示形式を変更
  const { displayMode, sheetCart, cartCount } = computeCartDisplayLogic(
    carts,
    selectedCart,
    targetCart)

  console.log("global carts", carts)

  // 
  useEffect(() => {
    console.log("useEff,carts bef", carts)
    console.log("useEff,carts bef", selectedCart)
    if(!carts || !selectedCart) return
    const updateCart = carts.find((cart) => cart.id === selectedCart.id) ?? null
    console.log("useEff,carts", carts)
    console.log("useEff,carts", updateCart)
    setSelectedCart(updateCart)
  }, [carts])

  // モーダルを閉じる時、選択カートをリセット
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
      openCart={openCart}
      />
  )
}

export default Cart