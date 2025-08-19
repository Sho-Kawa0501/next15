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

const data = await response.json()
// console.log(data)
}

