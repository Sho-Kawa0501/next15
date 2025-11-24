import React from 'react'
import { Restaurant } from '@/types'
import RestaurantCard from './restrant-card'

interface RestaurantListProps {
  restaurants: Restaurant[]
}

const RestaurantList = ({restaurants}: RestaurantListProps) => {
  return (
    <ul className="grid grid-cols-4 gap-4">
      {restaurants.map((restaurant) => (
        <RestaurantCard restaurant={restaurant} key={restaurant.id}/>
      ))}
    </ul>
  )
}

export default RestaurantList