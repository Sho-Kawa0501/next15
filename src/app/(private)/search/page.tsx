import React from 'react'
import { fetchCategoryRestaurants } from '@/lib/restaurants/api'
import RestaurantList from '@/components/restaurant-list'
import Categories from '@/components/categories'

const SearchPage = async ({searchParams,}: {
  searchParams: Promise<{
    category: string
  }>
}) => {
  const {category} = await searchParams
  console.log("SearchPage cateory", category)
  if(category) {
    const {data: categoryRestaurants, error: fetchError} = await fetchCategoryRestaurants(category)
    console.log("categoryRestaurants",categoryRestaurants)
  
  return (
    <>
      <div className="mb-4">
        <Categories />
      </div>
      {!categoryRestaurants ? (
        <p>{fetchError}</p>
      ): categoryRestaurants.length > 0 ?(
        <RestaurantList restaurants={categoryRestaurants} />
      ) : (
        <p>カテゴリ<strong>{category}</strong>に一致するレストランがありません</p>
      )}
    </>
  )
}
}

export default SearchPage