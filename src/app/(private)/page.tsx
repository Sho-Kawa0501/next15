import Image from "next/image";
// import MyButton from "./parent1";
import { Section } from "@/components/section";
import CarouselContainer from "@/components/carousel-container";
import RestrantCard from "@/components/restrant-card";
import { fetchRamenRestaurants } from "@/lib/restaurants/api";



export default async function Home() {
  const buttonText = "test"
  const onClickButton = () => {
    console.log("test1")
  }
  await fetchRamenRestaurants()
  return (
    <Section title="近くのお店">
      <CarouselContainer slideToShow={4}>
        {Array.from({ length:5}).map((_, index) => (
          [<RestrantCard key={index}/>]
        ))}
      </CarouselContainer>
    </Section>
  );
}
