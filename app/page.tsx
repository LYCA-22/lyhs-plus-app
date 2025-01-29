"use client";
import { useState, useEffect, useRef } from "react";
import { SchoolSystem } from "../components/SchoolSystem";
import { icons } from "@/components/icons";
import { motion } from "framer-motion";
import { apiService } from "@/services/api";
import Link from "next/link";
import { Mail } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselApi,
} from "@/components/ui/carousel";
import Image from "next/image";

export default function Home() {
  const scrollContainer = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 2;
  const [api, setApi] = useState<CarouselApi>();

  const scrollToSlide = (index: number) => {
    api?.scrollTo(index);
  };

  useEffect(() => {
    const result = apiService.getProposal();
    console.log(result);

    const checkScroll = () => {
      if (scrollContainer.current) {
        const { scrollLeft, scrollWidth, clientWidth } =
          scrollContainer.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
      }
    };

    const container = scrollContainer.current;
    if (container) {
      container.addEventListener("scroll", checkScroll);
      // 初始檢查
      checkScroll();

      return () => container.removeEventListener("scroll", checkScroll);
    }
  }, []);

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
      <div className="relative mt-4">
        <div
          className="flex overflow-x-auto px-2 relative scroll-smooth scrollbar-hide"
          ref={scrollContainer}
        >
          <SchoolSystem />
          <Link
            href={"/mailbox/student"}
            className="min-w-fit p-2 px-4 bg-background text-foreground border border-borderColor flex gap-2 justify-center items-center rounded-full transition-all font-medium m-1 hover:opacity-70 active:scale-95 hover:bg-hoverbg"
          >
            <Mail size={24} />
            學權信箱
          </Link>
          <button className="min-w-fit p-2 px-3 bg-background text-foreground border border-borderColor flex justify-center items-center rounded-full transition-all m-1 hover:opacity-70 active:scale-95 hover:bg-hoverbg">
            學校網站
          </button>
          <button className="min-w-fit p-2 px-3 bg-background text-foreground border border-borderColor flex justify-center items-center rounded-full transition-all m-1 hover:opacity-70 active:scale-95 hover:bg-hoverbg">
            學校網站
          </button>
          <button className="min-w-fit p-2 px-3 bg-background text-foreground border border-borderColor flex justify-center items-center rounded-full transition-all m-1 hover:opacity-70 active:scale-95 hover:bg-hoverbg">
            學校網站
          </button>
        </div>
        {canScrollLeft && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="absolute top-0 left-0 bg-gradient-to-l w-[80px] h-full to-white from-white/0 dark:to-background dark:from-black/0"
          ></motion.div>
        )}
        {canScrollRight && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="absolute top-0 right-0 bg-gradient-to-l w-[80px] h-full to-white/0 from-white dark:from-background dark:to-black/0"
          ></motion.div>
        )}
      </div>
      <div className="p-2 bg-hoverbg rounded-xl m-3 mt-5">天氣資訊</div>
    </div>
  );
}
