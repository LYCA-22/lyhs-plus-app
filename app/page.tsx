"use client";
import { useState } from "react";
import { icons } from "@/components/icons";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselApi,
} from "@/components/ui/carousel";
import Image from "next/image";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 2;
  const [api, setApi] = useState<CarouselApi>();

  const scrollToSlide = (index: number) => {
    api?.scrollTo(index);
  };

  return (
    <div className="p-3 sm:p-0">
      <div className="p-3 relative sm:p-0">
        <Carousel
          className="rounded-2xl sm:rounded-bl-none sm:rounded-br-none bg-gradient-to-br from-hoverbg to-white p-5"
          opts={{
            align: "start",
            loop: true,
          }}
          setApi={(api) => {
            setApi(api);
            api?.on("select", () => {
              setCurrentSlide(api.selectedScrollSnap());
            });
          }}
        >
          <CarouselContent>
            <CarouselItem className="flex flex-col items-center">
              <Image
                className="w-1/2"
                alt="post1"
                src={"./post-photo-1.svg"}
                width={20}
                height={20}
              />
              <div className="w-full">
                <h1 className="font-bold text-lg">歡迎使用LYHS+</h1>
                <p className="text-sm opacity-50">盡情探索LYHS+的功能吧！</p>
              </div>
            </CarouselItem>
            <CarouselItem className="flex flex-col items-center">
              <Image
                className="w-1/2"
                alt="post1"
                src={"./post-photo-2.svg"}
                width={20}
                height={20}
              />
              <div className="w-full">
                <h1 className="font-bold text-lg">我們正在招募團隊成員</h1>
                <p className="text-sm opacity-50">
                  加入我們一起成為校園資訊發展的推手！
                </p>
              </div>
            </CarouselItem>
          </CarouselContent>
        </Carousel>
        <div className="flex justify-between p-3 items-center sm:px-7">
          <div className="flex gap-2">
            {[...Array(totalSlides)].map((_, index) => (
              <div
                key={index}
                onClick={() => scrollToSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  currentSlide === index ? "w-8 bg-primary" : "w-2 bg-gray-300"
                }`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                scrollToSlide(currentSlide - 1);
              }}
              className="bg-hoverbg p-2 rounded-full mt-2 hover:bg-buttonBg transition-all active:scale-95"
            >
              {icons["BarArrowLeft"]()}
            </button>
            <button
              onClick={() => {
                scrollToSlide(currentSlide + 1);
              }}
              className="bg-hoverbg p-2 rounded-full mt-2 hover:bg-buttonBg transition-all active:scale-95"
            >
              {icons["BarArrowRight"]()}
            </button>
          </div>
        </div>
      </div>
      <div className="relative">
        <div className="flex overflow-x-auto px-2 relative scroll-smooth scrollbar-hide">
          <Link
            href={"/mailbox/student"}
            className="min-w-fit p-2 px-4 text-foreground hover:bg-hoverbg flex flex-col justify-center items-center rounded-2xl transition-all font-medium m-1 hover:opacity-70 active:scale-95"
          >
            <Image
              alt="mailbox"
              src={"./mailboxIcon.svg"}
              width={60}
              height={60}
            />
            <p className="text-sm">學權信箱</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
