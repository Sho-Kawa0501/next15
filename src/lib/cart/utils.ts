import { Cart, CartItem } from "@/types";

export const sumItems = (cartItems: CartItem[]) => 
  cartItems.reduce((sum, item) => sum + item.quantity, 0)

export function computeCartDisplayLogic(
  carts:  Cart[] | undefined,
  selectedCart: Cart | null,
  targetCart: Cart | null
) {
  // カート無し
  if(!carts || carts.length === 0) {
    return {displayMode: "cartSheet", sheetCart: null, cartCount: 0}
  }

  // カートが1件のみ存在
  if(carts.length === 1) {
    const only = carts[0]
    return {
      displayMode: "cartSheet",
      sheetCart: only,
      cartCount: sumItems(only.cart_items)}
  }

  // 選択されたカートがある場合
  if(selectedCart) {
    return {
      displayMode: "cartSheet",
      sheetCart: selectedCart,
      cartCount: sumItems(selectedCart.cart_items)}
  }

  // ターゲットカートがある場合
  if(targetCart) {
    return {
      displayMode: "cartSheet",
      sheetCart: targetCart,
      cartCount: sumItems(targetCart.cart_items)}
  }

  return {displayMode: "cartDropDown", sheetCart: null, cartCount: 0}
}

export const calculateItemTotal = (item: CartItem) =>
  item.quantity * item.menus.price

export const calculateSubtotal = (cartItems: CartItem[]) =>
  cartItems.reduce((sum, item) => sum + calculateItemTotal(item), 0)

export const calculateTotalQuantity = (cartItem: CartItem[]) =>
  cartItem.reduce((sum, item) => sum + item.quantity, 0) 
  