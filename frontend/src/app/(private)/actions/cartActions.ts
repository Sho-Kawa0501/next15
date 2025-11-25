"use server"
import { getPlaceDetails } from "@/lib/restaurants/api";
import { Cart, Menu } from "@/types";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

type addToCartActionResponse = 
  {type: "new", cart: Cart} 
  | {type: "update", id: number}

// カート、カートアイテムの作成 or 更新
export async function addToCartAction(
  selectedItem: Menu,
  quantity: number,
  restaurantId: string
): Promise<addToCartActionResponse> {
  const supabase = await createClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  
  if (userError || !user) {
    redirect("/login");
  }

  const bucket = supabase.storage.from("menus")

  // ログインユーザーの対象の既存レストランカート情報取得
  const {data: existingCart, error: existingCartError} = await supabase
    .from("carts")
    .select("id")
    .match({user_id: user.id, restaurant_id: restaurantId})
    .maybeSingle()
    .overrideTypes<{id: number}, {merge: false}>()

  if (existingCartError) {
    console.error("カートの取得に失敗しました。", existingCartError)
    throw new Error("カートの取得に失敗しました。")
  }

  // 既存のカートが存在しない場合、カートを新規作成＆カートアイテム追加
  if(!existingCart) {
    const {data: newCart, error: newCartError} = await supabase
      .from("carts")
      .insert({
        restaurant_id: restaurantId,
        user_id: user.id
      })
      .select("id")
      .single()
      .overrideTypes<{id: number}, {merge: false}>()

    if (newCartError) {
      console.error("カートの取得に失敗しました。", newCartError);
      throw new Error("カートの取得に失敗しました。");
    }

    const newCartId = newCart.id

    // カートにアイテムを追加
    const {error: insertError} = await supabase
      .from("cart_items")
      .insert({
        quantity: quantity,
        cart_id: newCartId,
        menu_id: selectedItem.id
    })

    if (insertError) {
      console.error("カートアイテムの追加に失敗しました。", insertError);
      throw new Error("カートアイテムの追加に失敗しました。");
    }

    // 新規作成したカート情報取得
    const { data: insertedCart, error: insertedCartError } = await supabase
      .from('carts')
      .select(`
        id,
        restaurant_id,
        cart_items (
          id,
          quantity,
          menus (
            id,
            name,
            price,
            image_path
          )
        )
      `)
      // 新規作成されたカートのidを使用
      .match({
        user_id: user.id,
        id: newCartId
      })
      .single()

    if (insertedCartError) {
      console.error("カートデータの取得に失敗しました。", insertedCartError)
      throw new Error(`カートデータの取得に失敗しました。${insertedCartError}`)
    }

    const {data: restaurantData, error} = await getPlaceDetails(
      restaurantId,
      ["displayName", "photos"]
    )

    if (!restaurantData || error) {
      console.error(`レストランデータの取得に失敗しました。${error}`);
    }

    // 新規追加したカートをリターン
    const addCart: Cart = {
      ...insertedCart,
      cart_items: insertedCart.cart_items.map((item) => {
        const { image_path, ...restMenus } = item.menus
        const publicUrl = bucket.getPublicUrl(item.menus.image_path).data.publicUrl
        return {
          ...item,
          menus: {
            ...restMenus,
            photoUrl: publicUrl,
          },
        }
      }),
      restaurantName: restaurantData?.displayName,
      photoUrl: restaurantData?.photoUrl ?? ""
    }
    return { type: "new", cart: addCart}
  }

  //既存のカートが存在する場合、アイテムを追加 or 数量のみ更新
  const {data, error: upsertError} = await supabase.from("cart_items").upsert(
    {
      quantity: quantity,
      cart_id: existingCart.id,
      menu_id: selectedItem.id,
    },
    { onConflict: "menu_id, cart_id"}
  )
  .select("id")
  .single()

  if(upsertError) {
    console.error("カートアイテム追加・更新に失敗しました。", upsertError);
    throw new Error("カートアイテム追加・更新に失敗しました。");
  }

  return {type: "update", id: data.id }
}

// カート内アイテムの更新、カート削除
export async function updateCartItemAction(
  quantity: number,
  cartItemId: number,
  cartId: number
) {
  const supabase = await createClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  
  if (userError || !user) {
    redirect("/login");
  }
  // 削除処理
  if(quantity === 0) {
    const { count, error } = await supabase
      .from("cart_items")
      .select("*", {count: "exact", head: true})
      .eq("cart_id", cartId)

    if (error) {
      console.error("カートの削除に失敗しました。", error);
      throw new Error("カートの削除に失敗しました。");
    }

    // 最後の1つのアイテムの場合、カート自体を削除
    if(count === 1) {
      const { error: deleteCartError } = await supabase
        .from("carts")
        .delete()
        .match({ user_id: user.id, id: cartId })

      if (deleteCartError) {
        console.error("カートの削除に失敗しました。", error);
        throw new Error("カートの削除に失敗しました。");
      }
      return
    }

    const { error: deleteItemError } = await supabase
      .from("cart_items")
      .delete()
      .eq("id", cartItemId)
    if(deleteItemError) {
      console.error("カートの削除に失敗しました。", error);
      throw new Error("カートの削除に失敗しました。");
    }
    return
  }
  // quantityが0以外の場合、 数量更新
  const { error: updateError } = await supabase
    .from("cart_items")
    .update({
      quantity:quantity,
    })
    .eq("id", cartItemId)

  if (updateError) {
    console.error("カートアイテムの更新に失敗しました。", updateError);
    throw new Error("カートアイテムの更新に失敗しました。");
  }
}

export async function checkoutAction(
  cartId: number,
  fee: number,
  service: number,
  delivery: number
) {
  const supabase = await createClient()
  // カートデータを取得
  // ログインユーザーのカート情報取得
      const { data: cart, error: cartError } = await supabase
        .from('carts')
        .select(`
          id,
          restaurant_id,
          user_id,
          cart_items (
            id,
            quantity,
            menu_id,
            menus (
              id,
              name,
              price,
              image_path
            )
          )
      `)
      .eq("id", cartId)
      .single()
      if(cartError) {
        console.error("カート情報の取得に失敗しました", cartError)
        throw new Error("カート情報の取得に失敗しました");
      }
  const {restaurant_id, user_id, cart_items} = cart
  const subTotal = cart_items.reduce((sum, item) => sum + item.quantity * item.menus.price, 0)
  const total = fee + service + delivery + subTotal;
  // ordersテーブルにデータ挿入
  const {data: order, error: orderError} = await supabase.from("orders").insert({
    restaurant_id: restaurant_id,
    user_id: user_id,
    fee,
    service,
    delivery,
    subtotal_price: subTotal,
    total_price: total
  })
  .select("id")
  .single()
  if(orderError) {
    console.error("注文の作成の取得に失敗しました", orderError)
    throw new Error("注文の作成の取得に失敗しました");
  }

  const orderItems = cart_items.map((item) => ({
    quantity: item.quantity,
    order_id: order.id,
    menu_id: item.menu_id,
    price: item.menus.price,
    name: item.menus.name,
    image_path: item.menus.image_path,
  }));
  //orders_itemsテーブルにデータを挿入
  const { error: orderItemsError } = await supabase
    .from("order_items")
    .insert(orderItems);
  if (orderItemsError) {
    console.error("注文アイテムの登録に失敗しました", orderItemsError);
    throw new Error("注文アイテムの登録に失敗しました");
  }
  //カートデータを削除
  const { error: deleteError } = await supabase
    .from("carts")
    .delete()
    .eq("id", cartId);
  if (deleteError) {
    console.error("カート削除に失敗しました", deleteError);
    throw new Error("カート削除に失敗しました");
  }
}