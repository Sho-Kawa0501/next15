"use client"

import React, { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { Address, AddressResponse, AddressSuggestion } from '@/types'
import { useDebouncedCallback } from 'use-debounce';
import { AlertCircle, LoaderCircle, MapPin, Trash2 } from 'lucide-react';
import { deleteAddressAction, selectAddressAction, selectSuggestionAction } from '@/app/(private)/actions/addressActions';
import useSWR from "swr"
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';

const AddressModal = () => {
  const [inputText, setInputText] = useState("")
  const [sessionToken, setSessionToken] = useState(uuidv4())
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

  const router = useRouter()

  // 検索したテキストに沿って住所情報を取得
  const fetchSuggestions = useDebouncedCallback(async (input) => {
    if(!input.trim()) {
      setSuggestions([])
      return
    }
    // ルートハンドラ
    try {
      const response = await fetch(
        `/api/address/autocomplete?input=${input}&sessionToken=${sessionToken}`)
      if(!response.ok) {
        const errorData = await response.json()
        setErrorMessage(errorData.error)
        console.error(errorData.error)
        return
      }
      const data:AddressSuggestion[] = await response.json()
      setSuggestions(data)
    } catch (error) {
      setErrorMessage("予期せぬエラーが発生しました。")
    } finally {
      setIsLoading(false)
    }
  },1000)

  useEffect(() => {
    if(!inputText.trim()) {
      // setOpen(false)
      setSuggestions([])
      return
    }
    setIsLoading(true)
    // setOpen(true)
    fetchSuggestions(inputText)
  }, [inputText])

  // const fetcher = (url:string) => fetch(url).then(res => res.json())
  const fetcher = async (url: string) => {
    const response = await fetch(url)
    if(!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error)
    }

    const data = await response.json()
    return data
  }

  const { 
    data,
    error,
    isLoading: loading,
    mutate
  } = useSWR<AddressResponse>(`/api/address`, fetcher)

  if (error) {
    console.error(error)
    return <div>{error.message}</div>
  }
  if (loading) return <div></div>

  // 検索した住所押下時
  const handleSelectSuggestion = async (suggestions: AddressSuggestion) => {
    try {
      await selectSuggestionAction(suggestions, sessionToken)
      setSessionToken(uuidv4())
      setInputText("")
      mutate()
      router.refresh()
    } catch(error) {
      alert("予期せぬエラー発生")
    }
  }


  const handleSelectAddress = async (address: Address) => {
    try{
      await selectAddressAction(address.id)
      mutate()
      setOpen(false)
      router.refresh()
    } catch(error) {
      alert("予期せぬエラーが発生しました")
    }
  }

  // 保存済みの住所を削除
  const handleDeleteAddress = async (addressId: number) => {
    const ok = window.confirm("この住所を削除しますか？")
    if(!ok) return
    try{
      const selectedAddressId = data?.selectedAddress?.id
      // ServerActionsを使用
      await deleteAddressAction(addressId)
      mutate()
      if(selectedAddressId === addressId) {
        router.refresh()
      }
      setOpen(false)
    } catch(error) {
      alert("delete予期せぬエラーが発生しました")
    }
  }

  return (
    <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
      <DialogTrigger>
        {data?.selectedAddress ? data.selectedAddress.name : "住所を選択"}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>住所</DialogTitle>
          <DialogDescription className="sr-only">
            住所登録と選択
          </DialogDescription>
        </DialogHeader>

        <Command shouldFilter={false}>
          <div className="bg-muted mb-4">
            <CommandInput
              value={inputText}
              onValueChange={setInputText}
              placeholder="Type a command or search..." />
          </div>
        
          <CommandList>
            {inputText ? (
              <>
                <CommandEmpty>
                  <div className="flex items-center justify-center">
                    {isLoading ? (
                      <LoaderCircle className="animate-spin" />
                    ) : errorMessage ? (
                      <div className="flex items-center text-destructive gap-2">
                        <AlertCircle />
                        {errorMessage}
                      </div>
                    ) : (
                      "住所が見つかりません"
                    )}
                  </div>
                </CommandEmpty>

                {suggestions.map((suggestion) => (
                  <CommandItem 
                    onSelect={() => handleSelectSuggestion(suggestion)}
                    key={suggestion.placeId}
                    className="p5">
                    <MapPin />
                    <div>
                      <p>{suggestion.placeName}</p>
                      <p>{suggestion.address_text}</p>
                    </div>
                  </CommandItem>
                ))}
              </>
            ) : (
              <>              
                <h3 className="font-black text-lg mb-2">保存済みの住所</h3>
                {data?.addressList.map((address) => (
                  <CommandItem 
                    onSelect={() => handleSelectAddress(address)}
                    key={address.id}
                    className={cn("p-5 justify-between items-center", address.id === data?.selectedAddress?.id && "bg-muted")}>
                    <div>
                      <p className="font-bold">{address.name}</p>
                      <p>{address.address_text}</p>
                    </div>

                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAddress(address.id);
                      }}
                      size={"icon"}
                      variant={"ghost"}
                    >
                      <Trash2 />
                    </Button>
                     
                  </CommandItem>
                ))}
                
              </>
            )}
            
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  )
}

export default AddressModal