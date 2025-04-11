"use client";
import { useMemo, useState, useRef, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { NewView } from "@/components/newView";
import { Search, X } from "lucide-react";
import { closeBack } from "@/store/systemSlice";
import { formatDate } from "@/utils/formatDate";
import { icons } from "@/components/icons";
const ITEMS_PER_PAGE = 8;

export default function Page() {
  const NewsData = useAppSelector((state) => state.newsData.announcements);
  const AppData = useAppSelector((state) => state.systemData);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const [url, setUrl] = useState("");
  const [openSearch, setOpenSearch] = useState(false);

  useEffect(() => {
    dispatch(closeBack());
  });

  const departments = useMemo(() => {
    const depts = new Set(NewsData.map((news) => news.department));
    return ["all", "學生公告", ...Array.from(depts)];
  }, [NewsData]);

  const filteredNews = useMemo(() => {
    if (selectedDepartment !== "學生公告") {
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
        "段考",
        "選修",
        "學測",
        "指考",
        "分科",
        "分發",
        "分發結果",
        "繁星",
        "編班名單",
        "獎學金",
        "競賽",
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

  return (
    <>
      <NewView url={url} setUrlAction={setUrl} />
      <div className="relative w-full">
        <div
          className={`flex px-5 ${AppData.isPwa ? "mt-deviceTop" : "mt-5"} justify-between`}
        >
          <h1 className={`text-2xl font-medium`}>校園公告</h1>
          <button onClick={() => setOpenSearch(!openSearch)}>
            {openSearch ? (
              <X className="text-zinc-500 dark:text-zinc-200" size={20} />
            ) : (
              <Search className="text-zinc-500 dark:text-zinc-200" size={20} />
            )}
          </button>
        </div>
        <div
          className={`sticky ${AppData.isPwa ? "top-9" : "top-0"} p-3 z-20 flex flex-col px-0`}
        >
          <div className="flex flex-col gap-3">
            {openSearch && (
              <div className="p-2 px-4 rounded-2xl w-11/12 flex items-center gap-2 bg-hoverbg mx-4">
                <Search className="text-borderColor" size={20} />
                <input
                  type="text"
                  placeholder="搜尋公告"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="ring-0 grow bg-transparent focus:outline-none text-foreground"
                />
              </div>
            )}
            <div className="flex gap-2 grow scrollbar-hide scroll-smooth p-2 px-4">
              <div className="overflow-x-auto bg-zinc-900/70 dark:bg-zinc-50/20 backdrop-blur-md flex rounded-2xl overflow-y-hidden shadow-lg border border-borderColor scrollbar-hide">
                {departments.map((dept, index) => {
                  const isActive = selectedDepartment === dept;
                  const isPrevActive =
                    index > 0 && selectedDepartment === departments[index - 1];

                  return (
                    <div key={index} className="flex items-center">
                      {!isActive && !isPrevActive && index !== 0 && (
                        <div className="w-[2px] bg-zinc-400 min-h-5 rounded-full"></div>
                      )}
                      <button
                        key={dept}
                        onClick={() => setSelectedDepartment(dept)}
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
                    <h2 className="text-medium font-normal flex">
                      {news.title}
                    </h2>
                    <button
                      onClick={() => {
                        setUrl(news.link);
                      }}
                      className="flex gap-1 p-2 px-3 w-fit rounded-full mt-2 bg-transparent relative group -translate-x-3 cursor-pointer"
                    >
                      <div className="opacity-50 flex items-center gap-1 font-normal text-sm z-20">
                        {icons["eye"]()}
                        詳細資訊
                      </div>
                      <div className="absolute w-full h-full bg-hoverbg scale-75 z-10 opacity-0 top-0 right-0 rounded-full transition-all group-hover:opacity-100 group-hover:scale-100 group-active:bg-buttonBg" />
                    </button>
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
    </>
  );
}
