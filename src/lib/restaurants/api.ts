import { GooglePlacesDetailsApiResponse, GooglePlacesSearchApiResponse, PlaceDetailsAll } from "@/types"
import { transformPlaceResults } from "./utils"
import { PlaceSearchResult } from "@/types"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

// 近くのレストラン取得
export async function fetchRestaurants(lat: number, lng: number) {
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
          "latitude": lat,
          "longitude": lng},
        "radius": 500.0,
        
      }
    },
    languageCode: "ja",
    "rankPreference": "DISTANCE"
  }

  // GMPAPI呼び出し 
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
  if(!data.places) {
    return { data:[] }
  }

  // レスポンスの型を整形するための関数？
  const nearbyPlaces = data.places
  const machingPlaces = nearbyPlaces.filter((place) => place.primaryType && desiredTypes.includes(place.primaryType))

  //整形関数
  const restaurants = await transformPlaceResults(machingPlaces);
  return {data: restaurants}
}

// 近くのラーメン店取得
export async function fetchRamenRestaurants(lat: number, lng: number) {
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
          "latitude": lat,
          "longitude": lng},
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
export async function fetchCategoryRestaurants(category: string, lat: number, lng: number) {
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
          "latitude": lat,
          "longitude": lng},
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

// キーワード検索機能
export async function fetchRestaurantsByKeyword(query: string, lat: number, lng: number) {
  const url = "https://places.googleapis.com/v1/places:searchText"

  const apiKey = process.env.GOOGLE_API_KEY
  const header = {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": apiKey!,
    "X-Goog-FieldMask":
    "places.id,places.displayName,places.primaryType,places.photos",
  }

  const requestBody = {
    "textQuery": query,
    "pageSize": 10,
    "locationBias": {
      "circle": {
        "center": {
          "latitude": lat,
          "longitude": lng},
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
    return {error: `TextSearchRequest Error:${response.status}`}
  }

  const data:GooglePlacesSearchApiResponse = await response.json()
  // console.log(data)
  if(!data.places) {
    return { data:[] }
  }

  // レスポンスの型を整形するための関数？
  const textSearchPlaces = data.places

  //整形関数
  const restaurants = await transformPlaceResults(textSearchPlaces);
  
  return {data: restaurants}

}


export async function getPhotoUrl(name:string, maxWidth = 400) {
  "use cache"
    const apiKey = process.env.GOOGLE_API_KEY
    const url = `https://places.googleapis.com/v1/${name}/media?key=${apiKey}&maxWidthPx=${maxWidth}`
    return url;
  }

// GMPAPIよりレストラン情報を取得
export const getPlaceDetails = async (
  placeId: string,
  fields: string[],
  sessionToken:string
) => {

  const fieldsParam = fields.join(",")
  let url:string
  if(sessionToken) {
    url = `https://places.googleapis.com/v1/places/${placeId}?sessionToken=${sessionToken}&languageCode=ja`
  } else {
    url = `https://places.googleapis.com/v1/places/${placeId}?languageCode=ja`
  }

  const apiKey = process.env.GOOGLE_API_KEY
  const header = {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": apiKey!,
    // "X-Goog-FieldMask":
    // "places.id,places.displayName,places.primaryType,places.photos",
    "X-Goog-FieldMask": fieldsParam
  }

  const response = await fetch(url, {
    method:"GET",
    headers: header,
    next: {revalidate: 86400 }, //キャッシュからデータ取得
  })

  if(!response.ok) {
    const errorData = await response.json()
    console.error(errorData)
    return {error: `getPlaceDetails Error:${response.status}`}
  }

  const data: GooglePlacesDetailsApiResponse = await response.json()

  const results:PlaceDetailsAll = {}

  if(fields.includes("location") && data.location) {
    results.location = data.location
  }

  if(fields.includes("displayName") && data.displayName?.text) {
    results.displayName = data.displayName?.text
  }

  if(fields.includes("primaryType") && data.primaryType) {
    results.primaryType = data.primaryType
  }

  if(fields.includes("photos")) {
    // results.photoUrl = data.photos?.[0]?.name
    //   ? await getPhotoUrl(data.photos[0].name, 1200)
    //   : "/no_image.png"
    results.photoUrl = "/no_image.png"
  }
  return {data: results}
}

// ユーザーが選択している住所の座標または固定の座標を返す
export async function fetchLocation() {
  const DEFAULT_LOCATION = { lat: 35.6580382, lng: 139.6990609 };

  const supabase = await createClient()
  const {
    data: {user},
    error: userError,
  } = await supabase.auth.getUser()

  if(userError || !user) {
    redirect("/login")
  }

  const { data: selectedAddress, error: selectedAddressError } = await supabase
    .from('profiles')
    .select(
      `
      addresses (
    latitude,longitude
  )
    `
  )
    .eq("id", user.id).single()

    if(selectedAddressError) {
      console.error("緯度と経度の取得に失敗しました。", selectedAddressError)
      throw new Error("緯度と経度の取得に失敗しました。")
    }

    const lat = selectedAddress.addresses?.latitude ?? DEFAULT_LOCATION.lat;
    const lng = selectedAddress.addresses?.longitude ?? DEFAULT_LOCATION.lng;

    return {lat, lng}
}