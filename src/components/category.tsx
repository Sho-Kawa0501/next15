"use client"

import React from 'react'
import { CategoryType } from './categories'
import Image from 'next/image'
import { cn } from '@/lib/utils'

// 関数型 引数にstring1つ、voidは、戻り値がないことを表す。
interface CategoryProps {
  category: CategoryType
  onClick: (category: string) => void
  select: boolean
}

const Category = ({category, onClick, select}: CategoryProps) => {
  return (
    <div onClick={() => onClick(category.type)}>
      <div 
        className={cn(
          "relative aspect-square overflow-hidden rounded-full",
          select && "bg-green-200"
        )}>
        <Image 
          className="object-cover scale-75"
          src={category.imageUrl} 
          fill
          alt={category.categoryName}
          sizes="(max-width: 1280px) 10vw, 97px" />
      </div>
      <div className="mt-2 text-center">
        <p className="text-xs truncate">{category.categoryName}</p>
      </div>
    </div>
  )
}
     
export default Category      