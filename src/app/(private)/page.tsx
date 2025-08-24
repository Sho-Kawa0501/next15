import Image from "next/image";
// import MyButton from "./parent1";
import { Section } from "@/components/section";
import CarouselContainer from "@/components/carousel-container";
import RestrantCard from "@/components/restrant-card";
import { fetchRestaurants, fetchRamenRestaurants } from "@/lib/restaurants/api";
import { Restaurant } from "@/types";
import RestaurantList from "@/components/restaurant-list";
import Categories from "@/components/categories";

export default async function Home() {
  const buttonText = "test"
  const onClickButton = () => {
    console.log("test1")
  }

  const {data:nearybyRestaurants, error: nearybyRestaurantsError } = await fetchRestaurants()
  const {data:nearybyRamenRestaurants, error:nearybyRamenRestaurantsError } = await fetchRamenRestaurants()
  return (
    <>
      <Categories />
      {!nearybyRestaurants ? (
        <p>{nearybyRestaurantsError}</p>
      ): nearybyRestaurants.length > 0 ?(
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
