"use client"
import { Menu } from "@/types";
import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";

interface ModalContextType {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  openModal: (menu: Menu) => void
  closeModal: () => void
  selectedItem: Menu | null
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

export const ModalProvider = ({children} : {children: ReactNode}) => {
  const [isOpen,setIsOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Menu | null>(null)

  // モーダル表示
  const openModal = (menu: Menu) => {
    setIsOpen(true)
    setSelectedItem(menu)
  }

  // モーダル非表示
  const closeModal = () => {
    setIsOpen(false)
    setTimeout(() => setSelectedItem(null), 200)
  }

  return (
    <ModalContext.Provider value={{isOpen, setIsOpen, openModal, closeModal, selectedItem}}>
      {children}
    </ModalContext.Provider>
  )
}

export const useModal = () => {
  const context = useContext(ModalContext)
   if(!context) {
    throw new Error("useModalはModalProvider内で使用する必要があります。")
   }
   return context
}