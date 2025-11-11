"use server"
import { Menu } from "@/types";
import { createClient } from "@/utils/supabase/server";

import { redirect } from "next/navigation";

export async function addToCartAction(
  selectedItem: Menu,
  quantity: number,
  restaurantId: string
) {
  const supabase = await createClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  
  if (userError || !user) {
    redirect("/login");
  }

  // カート情報取得
  const {data: existingCart, error: existingCartError} = await supabase
    .from("carts")
    .select("id")
    .match({user_id: user.id, restaurant_id: restaurantId})
    .maybeSingle()
    .overrideTypes<{id: number}, {merge: false}>()

  if (existingCartError) {
    console.error("カートの取得に失敗しました。", existingCartError);
    throw new Error("カートの取得に失敗しました。");
  }

  // 既存のカートが存在しない場合、カートを新規作成＆アイテム追加
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

    // カートの中にアイテムを追加
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
    return
  }

  //既存のカートが存在する場合、アイテムを追加 or 数量のみ更新
  const {error: upsertError} = await supabase.from("cart_items").upsert(
    {
      quantity: quantity,
      cart_id: existingCart.id,
      menu_id: selectedItem.id,
    },
    { onConflict: "menu_id, cart_id"}
  )

  if(upsertError) {
    console.error("カートアイテム追加・更新に失敗しました。", upsertError);
    throw new Error("カートアイテム追加・更新に失敗しました。");
  }
}