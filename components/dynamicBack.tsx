"use client";
import { useAppSelector } from "@/store/hook";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft } from "@untitledui/icons";

type DynamicBackProps = {
  containerEl: HTMLElement | null;
};

export function DynamicBack({ containerEl }: DynamicBackProps) {
  const AppData = useAppSelector((state) => state.appStatus);
  const [showBackground, setShowBackground] = useState(false);

  useEffect(() => {
    if (!containerEl) return;

    const handleScroll = () => {
      setShowBackground(containerEl.scrollTop > 20);
    };

    handleScroll();
    containerEl.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      containerEl.removeEventListener("scroll", handleScroll);
    };
  }, [containerEl]);

  if (AppData.service_status.isBack) {
    return (
      <div
        className={`top-0 fixed z-50 flex items-center p-5 left-0 w-full ${showBackground ? "py-2 pl-3" : ""} ${AppData.device_info.operate_type === "PWA" ? "pt-12" : ""} transition-all`}
      >
        <motion.div
          className="absolute inset-0 bg-white/50 dark:bg-zinc-800/50 backdrop-blur-xl"
          initial={false}
          animate={{ opacity: showBackground ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        />
        <Link
          href={AppData.service_status.backLink}
          className={`z-20 ${showBackground ? "" : "bg-zinc-200 dark:bg-zinc-600"} rounded-2xl p-2 text-foreground w-fit`}
        >
          <ArrowLeft size={24} />
        </Link>
      </div>
    );
  }
}
