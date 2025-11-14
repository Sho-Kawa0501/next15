"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Button } from "./ui/button";
import { DialogClose } from "@radix-ui/react-dialog";
import { Cart, CartItem, Menu } from "@/types";
import { useEffect, useState } from "react";
import { addToCartAction } from "@/app/(private)/actions/cartActions";
import { KeyedMutator } from "swr";

interface MenuModalProps {
  isOpen: boolean
  closeModal: () => void
  selectedItem: Menu | null
  restaurantId: string
  openCart: () => void
  targetCart: Cart | null
  mutateCart: KeyedMutator<Cart[]>
}

export default function MenuModal({
  isOpen, 
  closeModal, 
  selectedItem,
  restaurantId,
  openCart,
  targetCart,
  mutateCart
}: MenuModalProps) {
  const [quantity, setQuantity] = useState(1)
  const existingCartItem = targetCart
    ? targetCart?.cart_items.find((item) => item.menus.id === selectedItem?.id) ?? null
    : null

  useEffect(() => {
    if(!selectedItem) return
    setQuantity(existingCartItem?.quantity ?? 1)
  }, [selectedItem, existingCartItem])

  const handleAddToCart = async () => {
    if(!selectedItem) return
    try {
      // ServerActions呼び出し
      const response = await addToCartAction(
        selectedItem,
        quantity,
        restaurantId
      )
      mutateCart((prevCarts: Cart[] | undefined) => {
        if(!prevCarts) return
        if(response.type === "new") {
          const { cart } = response
          // カート新規作成処理
          return [...prevCarts, cart]
        }

        if(!targetCart) return
        const cart = { ...targetCart}
        if(existingCartItem) {
          // 数量更新
          cart.cart_items = cart.cart_items.map((item) => 
            item.id === existingCartItem.id
              ? { ...item, quantity: quantity }
              : item
          )
        } else {
          // アイテム追加
          const newCartItem: CartItem = {
            id:response.id,
            menus:{
              id: selectedItem.id,
              name: selectedItem.name,
              price: selectedItem.price,
              photoUrl: selectedItem.photoUrl
            },
            quantity: quantity
          }
          cart.cart_items = [...cart.cart_items, newCartItem]
        }
      
        return prevCarts.map((c) => (c.id === cart.id ? cart : c))
      }, false)
      openCart()
      closeModal()
    } catch (error) {
      console.error(error)
      alert("エラーが発生しました")
    }
  }
  return (
    <Dialog 
      open={isOpen}
      onOpenChange={(open) => !open && closeModal()}
      >
      <DialogContent className="lg:max-w-4xl">
        {selectedItem && (
          <>
        <DialogHeader className="sr-only">
          <DialogTitle>{selectedItem.name}</DialogTitle>
          <DialogDescription>{selectedItem.name} の詳細</DialogDescription>
        </DialogHeader>

        <div className="flex gap-6">
          {/* 左 画像 */}
          <div className="relative aspect-square w-1/2 rounded-lg overflow-hidden">
            <Image
              fill
              src={selectedItem.photoUrl}
              alt={selectedItem.name}
              className="object-cover"
            />
          </div>

          {/* 右 詳細 */}
          <div className="flex flex-col flex-1 w-1/2">
            {/* 上部：名前と単価 */}
            <div className="space-y-2">
              <p className="text-2xl font-bold">{selectedItem.name}</p>
              <p className="text-lg font-semibold text-muted-foreground">
                ￥{selectedItem.price}
              </p>
            </div>

            {/* 中央：数量セレクト */}
            <div className="mt-4">
              <label htmlFor="quantity" className="sr-only">
                数量
              </label>
              <select
                id="quantity"
                name="quantity"
                className="border rounded-full pr-8 pl-4 h-10"
                aria-label="購入数量"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>
              <Button
                onClick={handleAddToCart}
                type="button"
                size="lg"
                className="mt-6 h-14 text-lg font-semibold"
              >
                {existingCartItem ? "商品を更新" : "商品を追加"}
                （￥{selectedItem.price * quantity}）
              </Button>
          </div>
        </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
