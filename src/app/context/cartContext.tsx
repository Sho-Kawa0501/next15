"use client"
import { Menu } from "@/types";
import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";

interface CartContextType {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  openCart: () => void
  closeCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider = ({children} : {children: ReactNode}) => {
  const [isOpen,setIsOpen] = useState(false)

  // モーダル表示
  const openCart = () => {
    setIsOpen(true) 
  }

  // モーダル非表示
  const closeCart = () => {
    setIsOpen(false)
  }

  return (
    <CartContext.Provider value={{isOpen, setIsOpen, openCart, closeCart}}>
      {children}
    </CartContext.Provider>
  )
}

export const useCartVisibility = () => {
  const context = useContext(CartContext)
   if(!context) {
    throw new Error("useCartVisibilityはCartProvider内で使用する必要があります。")
   }

   return context
}