"use client";
import { useMemo, useState, useRef, useEffect } from "react";
import { useAppSelector } from "@/store/hook";
import { NewView } from "@/components/newView";
import { Search } from "lucide-react";
const ITEMS_PER_PAGE = 8;

export default function Page() {
  const NewsData = useAppSelector((state) => state.newsData.announcements);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  // 取得所有不重複的部門列表
  const departments = useMemo(() => {
    const depts = new Set(NewsData.map((news) => news.department));
    return ["all", ...Array.from(depts)];
  }, [NewsData]);

  // 篩選邏輯
  const filteredNews = useMemo(() => {
    return NewsData.filter((news) => {
      const matchDepartment =
        selectedDepartment === "all" || news.department === selectedDepartment;
      const matchSearch = news.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchDepartment && matchSearch;
    });
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
          setTimeout(() => {
            setDisplayCount((prev) => prev + ITEMS_PER_PAGE);
            setIsLoading(false);
          }, 500);
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
      <div className="sticky top-0 bg-background border-b p-4 pb-2 z-10 flex flex-col">
        <div className="flex flex-col gap-3">
          <p className="text-xl mx-1 mt-2 font-medium">校園公告</p>
          <div className="p-2 px-4 rounded-full w-full flex items-center gap-2 bg-hoverbg">
            <Search className="text-borderColor" size={20} />
            <input
              type="text"
              placeholder="搜尋公告"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ring-0 grow bg-transparent focus:outline-none text-foreground"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 w-full">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDepartment(dept)}
                className={`px-3 py-1 rounded-full whitespace-nowrap ${
                  selectedDepartment === dept
                    ? "bg-foreground text-background"
                    : "bg-background border hover:bg-gray-100"
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
                className="border-b flex box-border p-5 px-6 border-borderColor"
              >
                <div className="flex items-center mr-2">
                  <p className="m-1 ml-0 mb-auto h-[35px] w-[35px] flex justify-center items-center rounded-full font-medium text-sm bg-foreground text-background">
                    {news.department[0]}
                  </p>
                </div>
                <div className="flex flex-col">
                  <div className="flex mb-1 font-medium gap-2">
                    <p>{news.department}</p>
                    <p className="opacity-45 font-normal">
                      {formatDate(news.date)}
                    </p>
                  </div>
                  <h2 className="text-medium font-normal flex">{news.title}</h2>
                  <NewView>
                    <iframe
                      src={news.link}
                      className="w-full h-full"
                      title={news.title}
                    ></iframe>
                  </NewView>
                </div>
              </div>
            ))}

            {/* 加載更多的公告 */}
            <div
              ref={observerTarget}
              className="h-10 flex items-center justify-center m-10"
            >
              {isLoading && displayCount < filteredNews.length && (
                <div className="animate-spin h-5 w-5 border-2 border-foreground rounded-full border-t-transparent" />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
