'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: 'https://www.next-food-delivery.com//auth/callback',
    },
  })

  if (data.url) {
    redirect(data.url)
  }}

export async function logout() {
  const supabase = await createClient()
  const { error: logoutError } = await supabase.auth.signOut()
  if(logoutError) {
    console.error(logoutError)
  }
}