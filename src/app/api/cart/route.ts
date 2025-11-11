import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try{
    const supabase = await createClient()
    const {
      data: {user},
      error: userError
    } = await supabase.auth.getUser()

    if(userError || !user) {
      return NextResponse.json({ error: "ユーザーが認証されていません"},{status: 401})
    }


    let { data: carts, error: cartsError } = await supabase
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
    `).eq("user_id", user.id)
    if(cartsError) {
      console.error("カート情報取得失敗", cartsError)
      return NextResponse.json(
        {error: "カート情報取得失敗"},
        {status: 500}
      )
    }
    console.log("carts", carts)
    return NextResponse.json(carts)
  } catch (error) {
    console.error(error)
    return NextResponse.json({error: "予期せぬエラーが発生しました"})
  }
}