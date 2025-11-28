'use client'

import React from 'react'
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command"
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce';
import { v4 as uuidv4 } from 'uuid';
import { RestaurantSuggestion } from "@/types"
import { AlertCircle, LoaderCircle, MapPin, Search } from "lucide-react";

interface PlaceSearchBarProps {
  lat: number,
  lng: number
}

export const PlaceSearchBar = ({lat, lng}: PlaceSearchBarProps) => {
  const [open, setOpen] = useState(false)
  const [inputText, setInputText] = useState("")
  const [sessionToken, setSessionToken] = useState(uuidv4())
  const [suggestions, setSuggestions] = useState<RestaurantSuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const clickedOnItem = useRef(false)
  const router = useRouter()

  const fetchSuggestions = useDebouncedCallback(async (input) => {
    if(!input.trim()) {
      setSuggestions([])
      return
    }
    try {
      const response = await fetch(
        `/api/restaurant/autocomplete?input=${input}&sessionToken=${sessionToken}`)
      if(!response.ok) {
        const errorData = await response.json()
        setErrorMessage(errorData.error)
        console.error(errorData.error)
        return
      }
      const data:RestaurantSuggestion[] = await response.json()
      setSuggestions(data)
    } catch (error) {
      setErrorMessage("予期せぬエラーが発生しました。")
    } finally {
      setIsLoading(false)
    }
  },1000)

  useEffect(() => {
      if(!inputText.trim()) {
        setOpen(false)
        setSuggestions([])
        return
      }
      setIsLoading(true)
      setOpen(true)
      fetchSuggestions(inputText)
  }, [inputText])

  const handleBlur = () => {
    if(clickedOnItem.current) {
      clickedOnItem.current = false
      return
    }
    setOpen(false)
  }
  const handleFocus = () => {
    setOpen(true)
  }

  // 検索バーにテキストを入力した際、押下した箇所によって処理条件を分岐。
  const handleSelectSuggestion = (suggestion:RestaurantSuggestion) => {
    if(suggestion.type === "placePrediction") {
      // レストラン個別ページに遷移
      router.push(
        `/restaurant/${suggestion.placeId}?sesstionToken=${sessionToken}&lat=${lat}&lng=${lng}`
      )
      setSessionToken(uuidv4())
    } else {
      router.push(
        // 検索結果となるページに遷移
        `/restaurant/${suggestion.placeId}?restaurant=${suggestion.placeName}`
      )
    }
  }

  const handleKeyDown = (e:React.KeyboardEvent<HTMLDivElement>) => {
    if(!inputText.trim()) return 
    if(e.key === "Enter") {
      router.push(`/search?restaurant=${inputText}`)
      setOpen(false)
    }
    setOpen(false)
  }

  return(
    <Command onKeyDown={handleKeyDown} className=" overflow-visible bg-muted" shouldFilter={false}>
      <CommandInput
        value={inputText}
        placeholder="Type a command or search..."
        onValueChange={setInputText}
        onBlur={handleBlur}
        onFocus={handleFocus}
      />
      {open && (
        <div className="relative">
          <CommandList className="absolute bg-background w-full shadow-md rounded-lg">
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
                  "レストランが見つかりません"
                 )}
              </div>
            </CommandEmpty>
            {suggestions.map((suggestion, index) => (
              <CommandItem 
                className='p-5'
                value={suggestion.placeName}
                key={suggestion.placeId ?? index}
                onSelect={() => handleSelectSuggestion(suggestion)}
                onMouseDown={() => clickedOnItem.current = true}
              >
                {suggestion.type === "queryPrediction" ? <Search /> : <MapPin />}
                <p>{suggestion.placeName}</p>
              </CommandItem>
            ))}
          </CommandList>
        </div>
      )}
  </Command>
  )
}

export default PlaceSearchBar