import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Bookmark, Heart, Menu } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
          <Avatar>
            <AvatarImage src={avatar_url} />
            <AvatarFallback>ユーザ-名</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-bold">{display_name}</div>
            <div>
              <UserInfoModal 
                userName={display_name}
                userEmail={email}
                />
            </div>
          </div>
        </div>
        {/* メニューエリア */}
        <ul className="space-y-4">
          <li>
            <Link href={"/orders"} className="flex items-center gap-4">
              <Bookmark fill="bg-primary" />
              <span className="font-bold">ご注文内容</span>
            </Link>
          </li>
          <li>
            <Link href={"favorites"} className="flex items-center gap-4">
              <Heart fill="bg-primary" />
              <span className="font-bold">お気に入り</span>
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
  );
}
