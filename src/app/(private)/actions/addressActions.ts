"use server"
import { getPlaceDetails } from "@/lib/restaurants/api"
import { AddressSuggestion } from "@/types"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

// 押下された住所を住所管理テーブルに保存し、プロフィールテーブルの選択住所を更新
export const selectSuggestionAction = async (
  suggestion: AddressSuggestion, sessionToken: string) => {
  const supabase = await createClient()
  // 
  const {data: locationData, error} = await getPlaceDetails(
    suggestion.placeId, 
    ["location"], 
    sessionToken)

  if (
    error ||
    !locationData ||
    !locationData.location ||
    !locationData.location.latitude ||
    !locationData.location.longitude
  ) {
    throw new Error("住所情報を取得できませんでした");
  }
  
  const { data: {user},error: userError} = await supabase.auth.getUser()
  if(userError || !user) {
    redirect("/login")
  }

  // 住所管理テーブル保存処理
  const {data: newAddress, error: insertError} = await supabase.from("addresses").insert({
    name: suggestion.placeName,
    address_text: suggestion.address_text,
    latitude: locationData.location.latitude,
    longitude: locationData.location.longitude,
    user_id: user.id
  }).select("id").single()

  if(insertError) {
    console.error("住所の保存に失敗しました。")
    throw new Error("住所の保存に失敗しました。")
  }

  // プロフィールテーブル更新処理
  const {error: updateError} = await supabase.from("profiles").update({
    selected_address_id: newAddress.id
  }).eq("id", user.id)

  if(updateError) {
    console.error("プロフィールの更新に失敗しました。")
    throw new Error("プロフィールの更新しました。")
  }
}

// プロフィールテーブルの選択住所カラムを、画面で指定した住所に更新
export async function selectAddressAction(addressId: number) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  // supabaseの情報を更新
  const { error: updateError } = await supabase
    .from("profiles")
    .update({
      selected_address_id: addressId,
    })
    .eq("id", user.id);

  if (updateError) {
    console.error("選択中の住所の更新に失敗しました。", updateError);
    throw new Error("選択中の住所の更新に失敗しました。");
  }
}

// 住所管理テーブルから、画面で指定した住所情報を削除
export async function deleteAddressAction(addressId: number) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const { error: deleteError } = await supabase
    .from("addresses")
    .delete()
    .eq("id", addressId)
    .eq("user_id", user.id);

  if (deleteError) {
    console.error("住所の削除に失敗しました。", deleteError);
    throw new Error("住所の削除に失敗しました。");
  }
}