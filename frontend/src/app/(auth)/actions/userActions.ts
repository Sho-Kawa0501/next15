'use server'

import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export async function updateUserInfoAction(userName :string) {
  const supabase = await createClient()
  const {data: {user}, error: userError} = await supabase.auth.getUser()
  if (userError || !user) {
    redirect(("/login"))
  }

  const { data, error: updateUserError } = await supabase.auth.updateUser({
    data: {
      full_name: userName,
      display_name: userName
    },
  })

  if(updateUserError) {
    console.error("ユーザー情報の更新に失敗しました。", updateUserError);
    throw new Error("ユーザー情報の更新に失敗しました。");
  }
  return data
}