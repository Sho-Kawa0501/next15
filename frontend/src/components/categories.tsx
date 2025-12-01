"use client"

import React from 'react'
import Category from './category'
import CarouselContainer from './carousel-container'
import { useRouter, useSearchParams } from 'next/navigation'
import { cdnImagePath } from '@/lib/utils'

export interface CategoryType {
  categoryName: string
  type: string
  imageUrl: string
}

const Categories = () => {
  const categories: CategoryType[] = [
    {
      categoryName: "ファーストフード",
      type: "fast_food_restaurant",
      imageUrl: cdnImagePath(`/images/categories/ファーストフード.png`),
    },
    {
      categoryName: "日本料理",
      type: "japanese_restaurant",
      imageUrl: cdnImagePath(`/images/categories/日本料理.png`),
    },
    {
      categoryName: "ラーメン",
      type: "ramen_restaurant",
      imageUrl: cdnImagePath(`/images/categories/ラーメン.png`),
    },
    {
      categoryName: "寿司",
      type: "sushi_restaurant",
      imageUrl: cdnImagePath(`/images/categories/寿司.png`),
    },
    {
      categoryName: "中華料理",
      type: "chinese_restaurant",
      imageUrl: cdnImagePath(`/images/categories/中華料理.png`),
    },
    {
      categoryName: "コーヒ-",
      type: "cafe",
      imageUrl: cdnImagePath(`/images/categories/コーヒー.png`),
    },
    {
      categoryName: "イタリアン",
      type: "italian_restaurant",
      imageUrl: cdnImagePath(`/images/categories/イタリアン.png`),
    },
    {
      categoryName: "フランス料理",
      type: "french_restaurant",
      imageUrl: cdnImagePath(`/images/categories/フランス料理.png`),
    },
    {
      categoryName: "ピザ",
      type: "pizza_restaurant",
      imageUrl: cdnImagePath(`/images/categories/ピザ.png`),
    },
    {
      categoryName: "韓国料理",
      type: "korean_restaurant",
      imageUrl: cdnImagePath(`/images/categories/韓国料理.png`),
    },
    {
      categoryName: "インド料理",
      type: "indian_restaurant",
      imageUrl: cdnImagePath(`/images/categories/インド料理.png`),
    },
  ]
  // 現在のURLからクエリ文字列を読み取るクライアントコンポーネントフック 
  const searchParams = useSearchParams()
  // ページ遷移に使用。urlを書き換えて遷移
  const router = useRouter()
  const currentCategory = searchParams.get("category")
  // CategoryコンポーネントのonClickイベントにて選択されたcategoryの値が返ってくる。
  const searchRestaurantOfCategory = (category: string) => {
    const params = new URLSearchParams(searchParams)
    // 現在のurlと、選択されたカテゴリーを比較
    if(currentCategory === category) {
      router.replace("/")
    } else {
      // 一致していない場合、urlを書き換える
      params.set("category", category)
      router.replace(`/search?${params}`)
    }
  }

  return (
    <CarouselContainer slideToShow={10}>
      {categories.map((category) => ( 
        <Category 
          key={category.type}
          category={category}
          onClick={searchRestaurantOfCategory}
          select={category.type === currentCategory}
          />
      ))}
    </CarouselContainer>
  )
}

export default Categories