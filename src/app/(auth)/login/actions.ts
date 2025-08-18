'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function login() {
  console.log("google login")
  //googleログイン
  // 非同期で
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
  provider: "google",
  options: {
    redirectTo: 'http://localhost:3000//auth/callback',
  },
})

if (data.url) {
  redirect(data.url) // use the redirect API for your server framework
}
}

export async function logout() {
  const supabase = await createClient()
  let { error } = await supabase.auth.signOut()

  if(error) {
    console.error(error)
  }

}

// export async function signup(formData: FormData) {
//   const supabase = await createClient()

//   // type-casting here for convenience
//   // in practice, you should validate your inputs
//   const data = {
//     email: formData.get('email') as string,
//     password: formData.get('password') as string,
//   }

//   const { error } = await supabase.auth.signUp(data)

//   if (error) {
//     redirect('/error')
//   }

//   revalidatePath('/', 'layout')
//   redirect('/')
// }

