import React from 'react'
import { ReactNode } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

interface CarouselContainerProps {
  children: ReactNode[]
  slideToShow: number
}

const CarouselContainer = ({ children, slideToShow }:CarouselContainerProps) => {
  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full"
    >
      <CarouselContent>
        {children.map((child, index) => (
          <CarouselItem key={index} className="basis-1/2" style={{ flexBasis: `${100 / slideToShow}%`}}>
            <div className="p-1">
              {child}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}

export default CarouselContainer