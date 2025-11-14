export interface GooglePlacesSearchApiResponse {
  places?: PlaceSearchResult[]
}

export interface PlaceSearchResult {
  id:string,
  displayName?: {
    languageCode: string,
    text:string
  },
  primaryType: string,
  photos: PlacePhoto[]
}

export interface PlacePhoto {
  name?: string
}

export interface Restaurant {
  id: string,
  restaurantName?: string,
  primaryType?: string,
  photoUrl: string
}

export interface GooglePlacesAutocompleteApiResponse {
  suggestions?: PlaceAutocompleteResult[]
}

export interface GooglePlacesDetailsApiResponse {
  location?: { latitude?: number; longitude?: number };
  displayName?: {
    languageCode?: string;
    text?: string;
  };
  primaryType?: string;
  photos?: PlacePhoto[];
}

// 
export interface PlaceDetailsAll {
  location?: { latitude?: number; longitude?: number };
  displayName?: string;
  primaryType?: string;
  photoUrl?: string;
}

export interface PlaceAutocompleteResult {
  placePrediction?: { // 単一の場所予測に関する詳細情報
    place?: string
    placeId?: string
    structuredFormat?: {
      mainText?: {
        text?:string
      }
      secondaryText?: {
        text?: string
      }
    }
  }
  queryPrediction?: { //単一のクエリ予測に関する詳細情報
    text?: {
      text?: string
    }
  }
}

export interface RestaurantSuggestion {
  type: string
  placeId?: string
  placeName: string
}

export interface AddressSuggestion {
  placeId: string
  placeName: string
  address_text: string
}

export interface Address {
  id: number
  name: string
  address_text: string
  latitude: number
  longitude: number
}

export interface AddressResponse {
  addressList: Address[]
  selectedAddress: Address
}

export interface CategoryMenu {
  categoryName: string;
  id: string;
  items: Menu[];
}

export interface Menu {
  id: number;
  name: string;
  photoUrl: string;
  price: number;
}

export interface Cart {
  restaurantName: string | undefined;
  photoUrl: string;
  id: number;
  restaurant_id: string;
  cart_items: CartItem[];
}

export interface CartItem {
  id: number;
  quantity: number;
  menus: {
    id: number;
    name: string;
    price: number;
    // image_path: string;
    photoUrl: string;
  };
}