import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Bookmark, Heart, Menu, Pencil } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { logout } from "@/app/(auth)/login/actions";
import UserInfoModal from "./auth/user-info-modal";

export default async function MenuSheet() {

  const supabase = await createClient()
  // ユーザーチェック
  const { data: { user } } = await supabase.auth.getUser()

  if(!user) {
    redirect("/login")
  }

  // ユーザー情報取得
  const {avatar_url, full_name, display_name, email} = user.user_metadata

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={"ghost"} size={"icon"}>
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-6">
        <SheetHeader className="sr-only">
          <SheetTitle>メニュー情報</SheetTitle>
          <SheetDescription>ユーザー情報とメニュー情報を表示</SheetDescription>
        </SheetHeader>
        {/* ユーザー情報エリア */}
        <div className="flex items-center gap-5">
          <div>
            <div className="font-bold">{display_name}</div>
            <div className="text-sm text-muted-foreground">{email}</div>
          </div>
        </div>
        <ul className="space-y-4">
          <li>
            <div className="flex items-center gap-4 font-bold">
              <Pencil fill="bg-primary" />
              <span>
                <UserInfoModal 
                  userName={display_name}
                />
              </span>
            </div>
          </li>
          <li>
            <Link href={"/orders"} className="flex items-center gap-4">
              <Bookmark fill="bg-primary" />
              <span className="font-bold">注文履歴</span>
            </Link>
          </li>
        </ul>
        <SheetFooter>
          <form>
            <Button formAction={logout}>ログアウト</Button>
          </form>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
