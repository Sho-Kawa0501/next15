'use client'
import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '../ui/input';
import { updateUserInfoAction } from '@/app/(auth)/actions/userActions';
import { Button } from '../ui/button';

interface UserInfoModalProps {
  userName: string
  userEmail: string
}

const UserInfoModal = ({userName, userEmail}: UserInfoModalProps) => {
  const [open, setOpen] = useState(false)
  const [inputUserName, setInputUserName] = useState<string>(userName)
  // バリデーションチェック
  // 入力された値をmenu-sheetコンポーネントに渡す
  // モーダルを開いたらユーザー情報を再取得（mutateを使用？）

  const handleUpdateUserInfo = async () => {
    console.log("inputUserName.userName", inputUserName)
    try {
      await updateUserInfoAction(inputUserName)
      setOpen(false)
    } catch {
      console.error("")
    }
  }

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(open) => setOpen(open)}
      >
      <DialogTrigger>ユーザー情報を変更する</DialogTrigger>
      <DialogContent className="lg:max-w-4xl">
        <div>UserInfoModal</div>
        
        <Input
          // label="ユーザー名" 
          name="user-name"
          autoComplete="off"
          value={inputUserName}
          onChange={(e) => setInputUserName(e.target.value)} />
        <Button
          onClick={(e) => {
            e.stopPropagation();
            handleUpdateUserInfo();
          }}
          size={"icon"}
          variant={"ghost"}
        >
          送信する
        </Button>
      </DialogContent>
    </Dialog>
    </>
  )
}

export default UserInfoModal