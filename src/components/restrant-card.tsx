import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function RestaurantCard() {
  return (
    <div className="relative">
      <Link href={"/abc"} className="inset-0 absolute z-10"></Link>
      <div className="relative aspect-video rounded-lg overflow-hidden">
        <Image
          className="object-cover"
          src={"/no_image.png"}
          fill
          alt="レストラン画像"
          sizes="(max-width: 1280px) 25%, 280px"
        />
      </div>
      <div className="flex justify-between items-center">
        <p className="font-bold">name</p>
        <div className="z-20">
          <Heart
            color="gray"
            strokeWidth={3}
            size={15}
            className="hover:fill-red-500 hover:stroke-0"
          />
        </div>
      </div>
    </div>
  );
}
