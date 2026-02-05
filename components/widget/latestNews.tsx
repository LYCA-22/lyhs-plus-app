// 首頁最新公告組件
import { useAppSelector } from "@/store/hook";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

export default function LatestNews() {
  const NewsData = useAppSelector((state) => state.annData);
  const [count, setCount] = useState(0);

  return (
    <div className="bg-hoverbg rounded-3xl p-4 m-2 space-y-3">
      <div>
        <h3 className="opacity-50">最新校園公告</h3>

        {/* 使用Motion套件，來達到文字更換的效果 */}
        {NewsData.schoolAnnDatas && count < NewsData.schoolAnnDatas.length ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={count}
              initial={{ scale: 0.99, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", duration: 0.7 }}
              className="overflow-y-auto overflow-x-hidden box-border h-full"
            >
              <p className="text-lg font-medium">
                {NewsData.schoolAnnDatas[count].title}
              </p>
            </motion.div>
          </AnimatePresence>
        ) : (
          <div>無最新公告</div>
        )}
      </div>

      <div className="flex items-center justify-between gap-3">
        <button
          disabled={count === 0}
          onClick={() => setCount(count - 1)}
          className="bg-buttonBg p-2 rounded-full disabled:opacity-40 transition-all hover:scale-105"
        >
          <ArrowLeft size={20} strokeWidth={3} className="opacity-50" />
        </button>
        <button
          disabled={count === NewsData.schoolAnnDatas.length - 1}
          onClick={() => setCount(count + 1)}
          className="bg-buttonBg p-2 rounded-full disabled:opacity-40 transition-all hover:scale-105"
        >
          <ArrowRight size={20} strokeWidth={3} className="opacity-50" />
        </button>
        <Link
          href={"/news"}
          className="bg-inputPrimary p-2 px-3 rounded-full text-white ml-auto flex gap-2 items-center"
        >
          查看更多
        </Link>
      </div>
    </div>
  );
}
