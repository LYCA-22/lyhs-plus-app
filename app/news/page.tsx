"use client";
import { useMemo, useState, useRef, useEffect } from "react";
import { useAppSelector } from "@/store/hook";
import { NewView } from "@/components/newView";
import { Search, Sparkles } from "lucide-react";
const ITEMS_PER_PAGE = 8;

export default function Page() {
  const NewsData = useAppSelector((state) => state.newsData.announcements);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  const departments = useMemo(() => {
    const depts = new Set(NewsData.map((news) => news.department));
    return ["all", ...Array.from(depts)];
  }, [NewsData]);

  const filteredNews = useMemo(() => {
    if (selectedDepartment !== "學生須知") {
      return NewsData.filter((news) => {
        const matchDepartment =
          selectedDepartment === "all" ||
          news.department === selectedDepartment;
        const matchSearch = news.title
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        return matchDepartment && matchSearch;
      });
    } else {
      const displayNews = [];
      const text = [
        "補考",
        "教育",
        "報名",
        "學生",
        "學生證",
        "學生證件",
        "學生證明",
        "學生證明文件",
        "段考",
        "學測",
        "指考",
        "分科",
        "分發",
        "分發結果",
      ];

      for (let i = 0; i < NewsData.length; i++) {
        if (text.some((keyword) => NewsData[i].title.includes(keyword))) {
          displayNews.push(NewsData[i]);
        }
      }
      return displayNews;
    }
  }, [NewsData, selectedDepartment, searchQuery]);

  const displayedNews = useMemo(() => {
    return filteredNews.slice(0, displayCount);
  }, [filteredNews, displayCount]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !isLoading &&
          displayCount < filteredNews.length
        ) {
          setIsLoading(true);
          setDisplayCount((prev) => prev + ITEMS_PER_PAGE);
          setIsLoading(false);
        }
      },
      { threshold: 0.1 },
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [displayCount, filteredNews.length, isLoading]);

  useEffect(() => {
    setDisplayCount(ITEMS_PER_PAGE);
  }, [selectedDepartment, searchQuery]);

  const formatDate = (dateString: string): string => {
    const now = new Date();
    const date = new Date(dateString.replace(/\//g, "-"));
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // 如果是今天
    if (diffDays === 0) {
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      if (diffHours < 24) {
        if (diffHours === 0) {
          const diffMinutes = Math.floor(diffTime / (1000 * 60));
          if (diffMinutes < 60) {
            return diffMinutes <= 0 ? "剛剛" : `${diffMinutes}分鐘前`;
          }
        }
        return `${diffHours}小時前`;
      }
      return "今天";
    }

    // 如果是昨天
    if (diffDays === 1) {
      return "昨天";
    }

    // 如果是前天
    if (diffDays === 2) {
      return "前天";
    }

    // 如果是7天內
    if (diffDays < 7) {
      return `${diffDays}天前`;
    }

    // 如果是今年內
    if (now.getFullYear() === date.getFullYear()) {
      return `${date.getMonth() + 1}月${date.getDate()}日`;
    }

    // 其他情況返回完整日期
    return dateString;
  };

  return (
    <div className="relative w-full max-sm:w-screen">
      <div className="sticky top-0 bg-background p-3 z-20 flex flex-col px-0">
        <div className="flex flex-col gap-3">
          <div className="p-2 px-4 rounded-full w-11/12 flex items-center gap-2 bg-hoverbg max-sm:hidden mx-4">
            <Search className="text-borderColor" size={20} />
            <input
              type="text"
              placeholder="搜尋公告"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ring-0 grow bg-transparent focus:outline-none text-foreground"
            />
          </div>
          <div className="sm:hidden flex fixed top-[14px] right-5 text-foreground">
            <Search size={20} />
          </div>
          <div className="flex gap-2 overflow-x-auto w-full px-4 scrollbar-hide scroll-smooth">
            <button
              onClick={() => setSelectedDepartment("學生須知")}
              className={`px-4 py-1 rounded-full whitespace-nowrap transition-all flex items-center gap-2 font-bold ${
                selectedDepartment === "學生須知"
                  ? "bg-foreground text-background bg-gradient-to-br from-orange-300 to-blue-500"
                  : "hover:bg-buttonBg bg-hoverbg"
              }`}
            >
              <Sparkles size={20} />
              學生公告
            </button>
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDepartment(dept)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-all font-medium ${
                  selectedDepartment === dept
                    ? "bg-sky-100 dark:bg-sky-900 text-sky-600 dark:text-blue-200"
                    : "bg-hoverbg hover:bg-buttonBg"
                }`}
              >
                {dept === "all" ? "全部" : dept}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="relative">
        {displayedNews.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            沒有符合條件的公告
          </div>
        ) : (
          <>
            {displayedNews.map((news, index) => (
              <div
                key={index}
                className="flex box-border border-b border-border p-3 px-5 relative"
              >
                <div className="flex flex-col gap-1 pt-2 w-full">
                  <div className="flex mb-1 font-medium items-center justify-between w-full">
                    <p className="font-medium p-2 border-b-0 px-3 border border-border dark:border-borderColor rounded-t-xl">
                      {news.department}
                    </p>
                    <p className="opacity-45 font-normal">
                      {formatDate(news.date)}
                    </p>
                  </div>
                  <h2 className="text-medium font-normal flex">{news.title}</h2>
                  <NewView url={news.link}></NewView>
                </div>
              </div>
            ))}
            <div
              ref={observerTarget}
              className="h-10 flex items-center justify-center m-10"
            ></div>
          </>
        )}
      </div>
    </div>
  );
}
