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
    <div className="h-full flex flex-col items-center justify-center">
      <h1 className="text-xl font-medium p-3">{title}</h1>
      <div className="text-7xl font-custom text-inputPrimary grow flex items-center justify-center">
        {timeLeft.days}
      </div>
    </div>
  );
}
