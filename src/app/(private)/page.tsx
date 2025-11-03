import Image from "next/image";
// import MyButton from "./parent1";
import { Section } from "@/components/section";
import CarouselContainer from "@/components/carousel-container";
import RestrantCard from "@/components/restrant-card";
import { fetchRestaurants, fetchRamenRestaurants, fetchLocation } from "@/lib/restaurants/api";
import { Restaurant } from "@/types";
import RestaurantList from "@/components/restaurant-list";
import Categories from "@/components/categories";

export default async function Home() {
  // 
  const { lat, lng } = await fetchLocation()
  // const onClickButton = () => {
    
  // }
  // 住所付近のレストラン情報取得
  const {data:nearybyRestaurants, error: nearybyRestaurantsError } = await fetchRestaurants(lat, lng)
  // 住所付近のラーメン店情報取得
  const {data:nearybyRamenRestaurants, error:nearybyRamenRestaurantsError } = await fetchRamenRestaurants(lat, lng)
  return (
    <>
      <Categories />
      {!nearybyRestaurants ? (
        <p>{nearybyRestaurantsError}</p>
      ): nearybyRestaurants.length > 0 ? (
        <Section title="近くのお店" expandedContent={<RestaurantList restaurants={nearybyRestaurants} />}>
          <CarouselContainer slideToShow={4}>
            {nearybyRestaurants.map((restaurant, index) => (
              <RestrantCard key={index} restaurant={restaurant}/>
            ))}
          </CarouselContainer>
        </Section>
      ) : (
        <p>近くにレストランがありません</p>
      )}

      {!nearybyRamenRestaurants ? (
        <p>{nearybyRamenRestaurantsError}</p>
      ): nearybyRamenRestaurants.length > 0 ?(
        <Section title="近くのラーメン店" expandedContent={<RestaurantList restaurants={nearybyRamenRestaurants} />}>
          <CarouselContainer slideToShow={4}>
            {nearybyRamenRestaurants.map((restaurant, index) => (
              <RestrantCard key={index} restaurant={restaurant}/>
            ))}
          </CarouselContainer>
        </Section>
      ) : (
        <p>近くにラーメン店がありません</p>
      )}
    </>
  );
}
