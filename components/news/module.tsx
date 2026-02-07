"use client";
import React from "react";
import { Check, Copy, Ellipsis, Search, Share } from "lucide-react";
import { schoolAnnData } from "@/store/newsSlice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Link from "next/link";

// NewsItem 組件
const NewsItem = React.memo(({ news }: { news: schoolAnnData }) => {
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = async () => {
    if (!news) return;

    const textToCopy = `看看我發現了什麼！${news.department}發布了一個新公告：${news.title}\n點這裡看更多${news.link}`;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("複製失敗:", err);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          text: `看看我發現了什麼！${news.department}發布了一個新公告：${news.title}\n\n點這裡看更多：${news.link}`,
        })
        .catch((error) => {
          // 可以顯示錯誤提示
          console.error("分享失敗", error);
        });
    } else {
      alert("此瀏覽器不支援分享功能");
    }
  };

  return (
    <Link
      href={`/ann/school/${encodeURIComponent(news.link)}`}
      className="flex gap-3 items-center justify-between border-b border-border dark:border-zinc-700 p-3 py-4 relative cursor-pointer w-full"
    >
      <div className="flex flex-col text-left gap-1">
        <div className="flex items-center gap-2">
          <p>{news.department}</p>
          <p className="text-sm text-sky-800  dark:text-sky-200/50">
            {news.date}
          </p>
        </div>
        <h2 className="font-normal flex text-[15px]">{news.title}</h2>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger className="p-1 rounded-full bg-sky-100 dark:bg-sky-800 ml-auto">
          <Ellipsis size={20} />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => handleShare()}>
            <Share size={18} />
            分享
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => copyToClipboard()}>
            {copied ? <Check size={18} /> : <Copy size={20} />}
            複製
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Link>
  );
});

NewsItem.displayName = "NewsItem";

// SearchBox 組件
const SearchBox = React.memo(
  ({
    searchQuery,
    onSearchChange,
  }: {
    searchQuery: string;
    onSearchChange: (value: string) => void;
  }) => {
    return (
      <div className="group mt-5 p-2 px-4 rounded-xl w-11/12 flex items-center gap-2 bg-hoverbg dark:bg-zinc-700/80 mx-4 focus-within:ring-1 focus-within:ring-sky-400 focus-within:bg-sky-50 dark:focus-within:bg-sky-950 dark:focus-within:ring-sky-700">
        <Search className="text-borderColor dark:text-zinc-500" size={20} />
        <input
          type="text"
          placeholder="搜尋"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="ring-0 grow bg-transparent focus:outline-none text-foreground"
        />
      </div>
    );
  },
);

SearchBox.displayName = "SearchBox";

// EmptyState 組件
const EmptyState = React.memo(() => (
  <div className="p-8 text-center text-gray-500">沒有符合條件的公告</div>
));

EmptyState.displayName = "EmptyState";

export { EmptyState, SearchBox, NewsItem };
