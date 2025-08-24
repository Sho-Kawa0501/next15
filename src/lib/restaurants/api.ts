import { GooglePlacesSearchApiResponse } from "@/types"
import { transformPlaceResults } from "./utils"
import { PlaceSearchResult } from "@/types"

// 近くのレストラン取得
export async function fetchRestaurants() {
  const url = "https://places.googleapis.com/v1/places:searchNearby"

  const apiKey = process.env.GOOGLE_API_KEY

  const desiredTypes = [
    "japanese_restaurant",
    "cafe",
    "cafeteria",
    "coffee_shop",
    "chinese_restaurant",
    "fast_food_restaurant",
    "hamburger_restaurant",
    "french_restaurant",
    "italian_restaurant",
    "pizza_restaurant",
    "ramen_restaurant",
    "sushi_restaurant",
    "korean_restaurant",
    "indian_restaurant",
  ]

  const header = {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": apiKey!,
    "X-Goog-FieldMask":
    "places.id,places.displayName,places.primaryType,places.photos",
  }

  const requestBody = {
    "includedTypes": desiredTypes,
    "maxResultCount": 10,
    "locationRestriction": {
      "circle": {
        "center": {
          "latitude": 35.6669248,
          "longitude": 139.6514163},
        "radius": 500.0,
        
      }
    },
    languageCode: "ja",
    "rankPreference": "DISTANCE"
  }
  const response = await fetch(url, {
      method:"POST",
      body:JSON.stringify(requestBody),
      headers: header,
      next: {revalidate: 86400 }, //キャッシュからデータ取得
    })

    if(!response.ok) {
      const errorData = await response.json()
      console.error(errorData)
      return {error: `NearBySearch Error:${response.status}`}
    }

    const data:GooglePlacesSearchApiResponse = await response.json()
    // console.log(data)
    if(!data.places) {
      return { data:[] }
    }

    // レスポンスの型を整形するための関数？
    const nearbyPlaces = data.places
    const machingPlaces = nearbyPlaces.filter((place) => place.primaryType && desiredTypes.includes(place.primaryType))

    console.log("nearbyPlaces", nearbyPlaces)
    console.log("mPlaces", machingPlaces)

    //整形関数
    const restaurants = await transformPlaceResults(machingPlaces);
    console.log("restrants"+JSON.stringify(restaurants))
    return {data: restaurants}

}

// 近くのラーメン店取得
export async function fetchRamenRestaurants() {
  const url = "https://places.googleapis.com/v1/places:searchNearby"

  const apiKey = process.env.GOOGLE_API_KEY
  const header = {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": apiKey!,
    "X-Goog-FieldMask":
    "places.id,places.displayName,places.primaryType,places.photos",
  }

  const requestBody = {
    "includedPrimaryTypes": ["ramen_restaurant"],
    "maxResultCount": 10,
    "locationRestriction": {
      "circle": {
        "center": {
          "latitude": 35.6669248,
          "longitude": 139.6514163},
        "radius": 500.0,
        
      }
    },
    languageCode: "ja",
    "rankPreference": "DISTANCE"
  }

  const response = await fetch(url, {
    method:"POST",
    body:JSON.stringify(requestBody),
    headers: header,
    next: {revalidate: 86400 }, //キャッシュからデータ取得
  })

  if(!response.ok) {
    const errorData = await response.json()
    console.error(errorData)
    return {error: `NearBySearch Error:${response.status}`}
  }

  const data:GooglePlacesSearchApiResponse = await response.json()
  // console.log(data)
  if(!data.places) {
    return { data:[] }
  }

  // レスポンスの型を整形するための関数？
  const nearbyRamenPlaces = data.places

  //整形関数
  const RamenRestaurants = await transformPlaceResults(nearbyRamenPlaces);
  return {data: RamenRestaurants}

}

// カテゴリー検索機能
export async function fetchCategoryRestaurants(category: string) {
  const url = "https://places.googleapis.com/v1/places:searchNearby"

  const apiKey = process.env.GOOGLE_API_KEY
  const header = {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": apiKey!,
    "X-Goog-FieldMask":
    "places.id,places.displayName,places.primaryType,places.photos",
  }

  const requestBody = {
    "includedPrimaryTypes": [category],
    "maxResultCount": 10,
    "locationRestriction": {
      "circle": {
        "center": {
          "latitude": 35.6669248,
          "longitude": 139.6514163},
        "radius": 500.0,
        
      }
    },
    languageCode: "ja",
    "rankPreference": "DISTANCE"
  }

  const response = await fetch(url, {
    method:"POST",
    body:JSON.stringify(requestBody),
    headers: header,
    next: {revalidate: 86400 }, //キャッシュからデータ取得
  })

  if(!response.ok) {
    const errorData = await response.json()
    console.error(errorData)
    return {error: `NearBySearch Error:${response.status}`}
  }

  const data:GooglePlacesSearchApiResponse = await response.json()
  // console.log(data)
  if(!data.places) {
    return { data:[] }
  }

  // レスポンスの型を整形するための関数？
  const categoryPlaces = data.places

  //整形関数
  const categoryRestaurants = await transformPlaceResults(categoryPlaces);
  
  return {data: categoryRestaurants}

}

export async function getPhotoUrl(name:string, maxWidth = 400) {
  "use cache"
  console.log("use cache getphotourl")
    const apiKey = process.env.GOOGLE_API_KEY
    const url = `https://places.googleapis.com/v1/${name}/media?key=${apiKey}&maxWidthPx=${maxWidth}`
    console.log(url)
    return url;
  }
