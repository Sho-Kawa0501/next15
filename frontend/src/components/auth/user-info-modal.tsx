'use client'
import React, { useState } from 'react'
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '../ui/input';
import { updateUserInfoAction } from '@/app/(auth)/actions/userActions';
import { Button } from '../ui/button';
import { useForm } from 'react-hook-form';

interface UserInfoModalProps {
  userName: string;
}

const updateUserNameFormData = z.object({
  inputUserName: z.string()
    .min(1, "ユーザー名は必須です")
    .max(20, "20文字以内で入力してください"),
})

type UpdateUserNameFormData = z.infer<typeof updateUserNameFormData>

const UserInfoModal = ({userName}: UserInfoModalProps) => {
  const [open, setOpen] = useState(false)
  const [inputUserName, setInputUserName] = useState<string>(userName)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateUserNameFormData>({
    resolver: zodResolver(updateUserNameFormData)
  })

  const handleUpdateUserInfo = async () => {
    try {
      await updateUserInfoAction(inputUserName)
      setOpen(false)
    } catch {
      console.error("予期せぬエラーが発生しました。")
    }
  }

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(open) => setOpen(open)}
      >
      <DialogTrigger>ユーザー名変更</DialogTrigger>
      <DialogContent className="lg:max-w-4xl">
        <DialogTitle>
          ユーザー名変更
        </DialogTitle>
        <Input
          autoComplete="off"
          value={inputUserName}
          {...register('inputUserName')}
          onChange={(e) => setInputUserName(e.target.value)} />
          {errors.inputUserName && 
            <span style={{ color: 'red', fontSize: '0.85rem' }}>
              {errors.inputUserName.message}
            </span>
          }
        <div className="flex justify-center">
          <Button
            onClick={
              handleSubmit(handleUpdateUserInfo)
            }
          >
            送信する
          </Button>
        </div>
      </DialogContent>
    </Dialog>
    </>
  )
}

export default UserInfoModal