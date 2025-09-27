"use client";
import { useEffect, useState } from "react";

interface CountdownProps {
  targetDate: Date;
  title: string;
  description: string;
}

export function CountdownTimer({
  targetDate,
  title,
  description,
}: CountdownProps) {
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
    <div className="bg-hoverbg rounded-3xl p-4 m-2 space-y-3 flex flex-col items-center justify-center text-inputPrimary text-center font-mono">
      <h1 className="font-sans text-[16px] font-medium text-foreground">
        {title}
      </h1>
      <p className="text-7xl font-bold">{timeLeft.days}</p>
      <p className="text-xs font-sans text-foreground opacity-50 border-t pt-2 border-borderColor">
        {description}
      </p>
    </div>
  );
}
