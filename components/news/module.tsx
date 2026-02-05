"use client";
import { formatDate } from "@/utils/formatDate";
import React from "react";
import { Check, CircleEllipsis, Copy, Search, Share } from "lucide-react";
import { schoolAnnData } from "@/store/newsSlice";

// NewsItem 組件
const NewsItem = React.memo(
  ({
    news,
    onViewDetails,
  }: {
    news: schoolAnnData;
    onViewDetails: (link: string) => void;
  }) => {
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
      <div className="flex box-border border-b border-border p-5 relative">
        <div className="flex flex-col gap-1 w-full">
          <div className="flex mb-1 font-medium items-center justify-between w-full">
            <p className="font-medium">{news.department}</p>
            <p className="opacity-45 font-normal">{formatDate(news.date)}</p>
          </div>
          <h2 className="text-medium font-normal flex">{news.title}</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onViewDetails(news.link)}
              className="flex gap-2 p-2 px-3 font-medium w-fit items-center text-background opacity-85 rounded-full mt-2 bg-foreground hover:opacity-50 transition-opacity"
            >
              <CircleEllipsis size={20} />
              查看更多
            </button>
            <button
              onClick={() => handleShare()}
              className="border border-border flex gap-2 p-2 font-medium w-fit items-center opacity-85 rounded-full mt-2 ml-auto bg-hoverbg hover:bg-buttonBg transition-all"
            >
              <Share size={18} />
            </button>
            <button
              onClick={() => copyToClipboard()}
              className="border border-border flex gap-2 p-2 font-medium w-fit items-center opacity-85 rounded-full mt-2 bg-hoverbg hover:bg-buttonBg transition-all"
            >
              {copied ? <Check size={18} /> : <Copy size={20} />}
            </button>
          </div>
        </div>
      </div>
    );
  },
);

NewsItem.displayName = "NewsItem";

// DepartmentSelector 組件
const DepartmentSelector = React.memo(
  ({
    departments,
    selectedDepartment,
    onDepartmentChange,
  }: {
    departments: string[];
    selectedDepartment: string;
    onDepartmentChange: (dept: string) => void;
  }) => {
    return (
      <div className="overflow-x-auto bg-zinc-900/70 dark:bg-zinc-50/20 backdrop-blur-md flex rounded-2xl overflow-y-hidden shadow-lg border border-borderColor scrollbar-hide">
        {departments.map((dept, index) => {
          const isActive = selectedDepartment === dept;
          const isPrevActive =
            index > 0 && selectedDepartment === departments[index - 1];

          return (
            <div key={dept} className="flex items-center">
              {!isActive && !isPrevActive && index !== 0 && (
                <div className="w-[2px] bg-zinc-400 min-h-5 rounded-full"></div>
              )}
              <button
                onClick={() => onDepartmentChange(dept)}
                className={`p-3 px-4 rounded-xl whitespace-nowrap transition-all font-medium ${
                  isActive
                    ? "bg-background dark:bg-foreground text-foreground dark:text-background"
                    : "text-background dark:text-zinc-300"
                }`}
              >
                {dept === "all" ? "全部" : dept}
              </button>
            </div>
          );
        })}
      </div>
    );
  },
);

DepartmentSelector.displayName = "DepartmentSelector";

// SearchBox 組件
const SearchBox = React.memo(
  ({
    searchQuery,
    onSearchChange,
    isOpen,
  }: {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    isOpen: boolean;
  }) => {
    if (!isOpen) return null;

    return (
      <div className="p-3 px-4 rounded-2xl w-11/12 flex items-center gap-2 bg-zinc-100/80 backdrop-blur-xl mx-4 shadow-xl shadow-hoverbg border border-zinc-200 dark:border-borderColor">
        <Search className="text-borderColor" size={20} />
        <input
          type="text"
          placeholder="搜尋公告"
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

export { EmptyState, SearchBox, DepartmentSelector, NewsItem };
