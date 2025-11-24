import { getPlaceDetails } from "@/lib/restaurants/api";
import { Cart } from "@/types";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try{
    const supabase = await createClient()
    // ユーザー情報取得、存在確認
    const {
      data: {user},
      error: userError
    } = await supabase.auth.getUser()
    if(userError || !user) {
      return NextResponse.json({ error: "ユーザーが認証されていません"},{status: 401})
    }
    // メニューファイルアクセス用
    const bucket = supabase.storage.from("menus")

    // ログインユーザーのカート情報取得
    const { data: carts, error: cartsError } = await supabase
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
    .eq("user_id", user.id)
    .order("id", {referencedTable: "cart_items", ascending: true})
    if(cartsError) {
      console.error("カート情報取得失敗", cartsError)
      return NextResponse.json(
        {error: "カート情報取得失敗"},
        {status: 500}
      )
    }

    // 対象のレストランの名称、画像を取得
    const promises = carts.map(async (cart):Promise<Cart> => {
      const {data: restaurantData, error} = await getPlaceDetails(
        cart.restaurant_id,
        ["displayName", "photos"]
      )

      if (!restaurantData || error) {
        console.error(`レストランデータの取得に失敗しました。${error}`);
      }
      
      // Cart型のオブジェクトをリターン
      return {
        ...cart,
        cart_items: cart.cart_items.map((item) => {
          // 画像取得用としてimage_pathを抽出
          const { image_path, ...restMenus } = item.menus
          // メニュー画像パス取得
          const publicUrl = bucket.getPublicUrl(item.menus.image_path).data.publicUrl
          return {
            // CartItem型オブジェクトをリターン
            ...item,
            menus: {
              ...restMenus,
              photoUrl: publicUrl,
            },
          }
        }),
        restaurantName: restaurantData?.displayName ?? "不明な店舗",
        photoUrl: restaurantData?.photoUrl ?? "/no_imae.png"
      }
    })

    const results = await Promise.all(promises)

    return NextResponse.json(results)
  } catch (error) {
    console.error(error)
    return NextResponse.json({error: "予期せぬエラーが発生しました"}, {status: 500})
  }
}