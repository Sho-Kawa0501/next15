import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getPlaceDetails } from "../restaurants/api";
import { Order } from "@/types";

export async function fetchOrders():Promise<Order[]> {
  const supabase = await createClient();
  const bucket = supabase.storage.from("menus");
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user || userError) {
    redirect("/login");
  }

  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select(
      `
    id,
    restaurant_id,
    created_at,
    fee,
    service,
    delivery,
    subtotal_price,
    total_price,
    order_items (
      id,
      price,
      quantity,
      name,
      image_path
    )
  `
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (ordersError) {
    console.error("注文履歴の取得に失敗しました。", ordersError);
    throw new Error("注文履歴の取得に失敗しました。");
  }

  // 対象のレストランの名称、画像を取得
  const promises = orders.map(async (order):Promise<Order> => {
    const {data: restaurantData, error} = await getPlaceDetails(
      order.restaurant_id,
      ["displayName", "photos"]
    )

    if (!restaurantData || error) {
      // throw new Error(`レストランデータの取得に失敗しました。${error}`);
      console.error(`レストランデータの取得に失敗しました。${error}`);
    }
    
    // Cart型のオブジェクトをリターン
    return {
      ...order,
      order_items: order.order_items.map((item) => {
        // 画像取得用としてimage_pathを抽出
        const { image_path, ...restMenus } = item
        // メニュー画像パス取得
        const publicUrl = bucket.getPublicUrl(image_path).data.publicUrl
        return {
          ...restMenus,
          photoUrl: publicUrl,
        }
      }),
      restaurantName: restaurantData?.displayName ?? "不明な店舗",
      photoUrl: restaurantData?.photoUrl ?? "/no_imae.png"
    }
  })

  const results = await Promise.all(promises)
  return results
}