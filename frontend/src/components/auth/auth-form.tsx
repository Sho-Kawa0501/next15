"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AuthInput } from "./input";

interface AuthFormProps {
  title: string;
  mode: "login" | "signup";
  action: (formData: FormData) => void;
  error?: string;
}

export function AuthForm({
  title,
  mode,
  action,
  error,
}: AuthFormProps) {
  return (
    <div className="w-full max-w-lg mx-auto p-6 space-y-6">
      <h1 className="text-2xl text-center font-semibold">{title}</h1>
      {error && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-100 p-3 rounded">
          エラー: {error}
        </div>
      )}
      {/* Googleアカウント ログイン */}
      {mode === "login" && (
        <>
          <form action={action} className="grid gap-4">
            <input type="hidden" name="provider" value="google" />
            <Button type="submit">Googleアカウントでログイン</Button>
          </form>
          <div className="text-center text-sm text-muted-foreground">または</div>
        </>
      )}
      {/* メールアドレス&パスワード ログイン */}
      <form action={action} className="grid gap-4">
        {mode === "signup" && (
          <AuthInput label="ユーザー名" name="username" type="text" />
        )}
        <AuthInput label="メールアドレス" name="email" type="email" />
        <AuthInput label="パスワード" name="password" type="password" />
        <Button type="submit" variant="outline">
          {mode === "login" ? "メールアドレスでログイン" : "メールアドレスで登録"}
        </Button>
      </form>
      <div className="text-sm text-center">
        {mode === "login" ? (
          <span>
            <Link href="/signup" className="underline">
              新規登録はこちら
            </Link>
          </span>
        ) : (
          <span>
            すでにアカウントをお持ちですか？
            <Link href="/login" className="underline">
              ログインはこちら
            </Link>
          </span>
        )}
      </div>
    </div>
  );
}