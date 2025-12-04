'use server'

import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export async function updateUserInfo() {
  const supabase = await createClient()
  const {data: {user}, error: userError} = await supabase.auth.getUser()
  if (userError || !user) {
    redirect(("/login"))
  }

  const { data, error: updateUserError } = await supabase.auth.updateUser({
    data: {
      full_name: ""
    },
    email: 'new@email.com',
    password: "",
  })

  if(updateUserError) {
    console.error("ユーザー情報の更新に失敗しました。", updateUserError);
    throw new Error("ユーザー情報の更新に失敗しました。");
  }
  return data
}

