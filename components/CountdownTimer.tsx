"use client";
import { useEffect, useState } from "react";

interface CountdownProps {
  targetDate: Date;
  title: string;
}

export function CountdownTimer({ targetDate, title }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +targetDate - +new Date();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex flex-col relative w-full gap-2 h-full">
      <h1 className="text-xl font-normal">{title}</h1>
      <div className=" font-extrabold w-full font-custom text-inputPrimary grow flex items-center justify-between">
        <div className="h-full p-3 px-4 bg-inputPrimary text-white rounded-tl-2xl flex items-center gap-2">
          <p className="text-5xl">{timeLeft.days}</p>
          <p className="text-sm h-9 w-9 flex items-center justify-center rounded-full bg-foreground text-background">
            天
          </p>
        </div>
      </div>
    </div>
  );
}
