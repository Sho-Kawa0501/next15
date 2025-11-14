import {NextRequest, NextResponse} from "next/server"
import { AddressSuggestion, GooglePlacesAutocompleteApiResponse, RestaurantSuggestion } from "@/types"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const input = searchParams.get("input")
  const sessionToken = searchParams.get("sessionToken")
  if(!input) {
    return NextResponse.json({error: "文字がありません"}, {status: 400})
  }

  if(!sessionToken) {
    return NextResponse.json({error: "セッショントークンがありません"}, {status: 400})
  }
  try {
    const url = "https://places.googleapis.com/v1/places:autocomplete"

    const apiKey = process.env.GOOGLE_API_KEY
    const header = {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey!,
    
    }

    const requestBody = {
      // includeQueryPredictions: true,
      input: input,
      sessionToken,
      // includedPrimaryTypes: ["restaurant"],
      locationBias: {
        "circle": {
          "center": {
            "latitude": 35.6669248,
            "longitude": 139.6514163},
          "radius": 500.0,
          
        }
      },
      languageCode: "ja",
      // includedRegionCodes: ["jp"],
      regionCode: "jp"
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
    return NextResponse.json(
      {error: `AutoCompleteリクエスト失敗:${response.status}`},
      {status: 500}
    )
  }
  const data:GooglePlacesAutocompleteApiResponse = await response.json()

  const suggestions = data.suggestions ?? []

  const results = suggestions.map((suggestion) => {
    return {
      placeId: suggestion.placePrediction?.placeId,
      placeName: suggestion.placePrediction?.structuredFormat?.mainText?.text,
      address_text: suggestion.placePrediction?.structuredFormat?.secondaryText?.text
    }
  }).filter((suggestion): suggestion is AddressSuggestion => 
    !!suggestion.placeId && 
    !!suggestion.placeName && 
    !!suggestion.address_text)

  return NextResponse.json(results)
  } catch(error) {
    console.error(error)
    return NextResponse.json({error: "予期せぬエラーが発生しました"}, {status: 500})
  }
}
