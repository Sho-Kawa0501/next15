"use client";

import React, { useReducer } from "react";
import { Search } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function MenuSeachBar() {
  const searchParams = useSearchParams()
  const pathName = usePathname()
  const {replace} = useRouter()
  const handleSearchMenu = useDebouncedCallback((inputText:string) => {
    const params = new URLSearchParams(searchParams)
    if(inputText.trim()) {
      params.set("searchMenu", inputText)
    } else {
      params.delete("searchMenu")
    }
    const query = params.toString()
    replace(query ? `${pathName}?${params.toString()}` : pathName)
}, 500)
  return (
    <div className="flex items-center bg-muted rounded-full">
      <Search size={20} color="gray" className="ml-2" />
      <input
        type="text"
        placeholder="メニューを検索"
        className="flex-1 px-4 py-2 outline-none"
        onChange={(e) => handleSearchMenu(e.target.value)}
      />
    </div>
  );
}
