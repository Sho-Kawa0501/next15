"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

interface OAuthError {
  message?: string;
}

export async function login(formData: FormData) {
  const supabase = await createClient();
  const provider = (formData.get("provider") as string) ?? "";

  // Googleアカウント ログイン
  if (provider === "google") {
    const siteUrl = process.env.NEXT_PUBLIC_APP_URL
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${siteUrl}/auth/callback` },
    });

    if (error) {
      const msg = (error as OAuthError).message ?? "oauth_failed";
      redirect(`/login?error=${encodeURIComponent(msg)}`);
    }

    if (data?.url) redirect(data.url);
    redirect("/login");
  }

  // メールアドレス、パスワード ログイン
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    redirect("/login?error=missing");
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    const msg = error.message ?? "login_failed";
    redirect(`/login?error=${encodeURIComponent(msg)}`);
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();
  const username = String(formData.get("username") ?? "");
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    redirect("/signup?error=missing");
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: 
      { 
        data: { 
          display_name: username,
          full_name: username,
        }
      },
  });

  if (error) {
    const msg = error.message ?? "signup_failed";
    redirect(`/signup?error=${encodeURIComponent(msg)}`);
  }

  revalidatePath("/login", "layout");
  redirect("/");
}

export async function logout() { 
  const supabase = await createClient() 
  const { error } = await supabase.auth.signOut() 
  if(error) { 
    console.error(error) 
  } 
}