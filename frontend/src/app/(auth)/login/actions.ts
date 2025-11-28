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

  // ===== OAuth Login =====
  if (provider === "google") {
    const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${siteUrl}/auth/callback` },
    });

    if (error) {
      const msg = (error as OAuthError).message ?? "oauth_failed";
      redirect(`/auth/login?error=${encodeURIComponent(msg)}`);
    }

    if (data?.url) redirect(data.url);
    redirect("/auth/login");
  }

  // ===== Email Login =====
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    redirect("/auth/login?error=missing");
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    const msg = error.message ?? "login_failed";
    redirect(`/auth/login?error=${encodeURIComponent(msg)}`);
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
    redirect("/auth/signup?error=missing");
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { display_name: username } },
  });

  if (error) {
    const msg = error.message ?? "signup_failed";
    redirect(`/auth/signup?error=${encodeURIComponent(msg)}`);
  }

  revalidatePath("/login", "layout");
  redirect("/auth/login?registered=1");
}

export async function logout() { 
  const supabase = await createClient() 
  const { error } = await supabase.auth.signOut() 
  if(error) { 
    console.error(error) 
  } 
}