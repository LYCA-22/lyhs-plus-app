"use client";
import React, { useMemo, useState, useRef, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { Bookmark, Search, X } from "lucide-react";
import { NewView } from "@/components/news/display";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import FavoritesList from "@/components/news/favoritesList";
import { EmptyState, NewsItem, SearchBox } from "@/components/news/module";
import { turnOffBackLink } from "@/store/appSlice";
const ITEMS_PER_PAGE = 8;
const STUDENT_KEYWORDS = [
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

export default function Page() {
  const NewsData = useAppSelector((state) => state.annData.schoolAnnDatas);
  const AppData = useAppSelector((state) => state.appStatus);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const [url, setUrl] = useState("");
  const [openSearch, setOpenSearch] = useState(false);

  const normalizedSearchQuery = useMemo(
    () => searchQuery.toLowerCase().trim(),
    [searchQuery],
  );

  useEffect(() => {
    dispatch(turnOffBackLink());
  }, [dispatch]);

  const departments = useMemo(() => {
    const depts = new Set(NewsData.map((news) => news.department));
    return ["all", "學生公告", ...Array.from(depts)];
  }, [NewsData]);

  const filteredNews = useMemo(() => {
    if (selectedDepartment === "學生公告") {
      return NewsData.filter((news) =>
        STUDENT_KEYWORDS.some((keyword) => news.title.includes(keyword)),
      );
    }

    return NewsData.filter((news) => {
      const matchDepartment =
        selectedDepartment === "all" || news.department === selectedDepartment;
      const matchSearch =
        normalizedSearchQuery === "" ||
        news.title.toLowerCase().includes(normalizedSearchQuery);
      return matchDepartment && matchSearch;
    });
  }, [NewsData, selectedDepartment, normalizedSearchQuery]);

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
          className={`flex px-5 ${AppData.device_info.operate_type == "PWA" ? "mt-deviceTop" : "mt-5"} justify-between`}
        >
          <h1 className={`text-2xl font-medium`}>校園公告</h1>
          <div className="flex items-center gap-5">
            <button onClick={() => setOpenSearch(!openSearch)}>
              {openSearch ? (
                <X className="text-zinc-500 dark:text-zinc-200" size={20} />
              ) : (
                <Search
                  className="text-zinc-500 dark:text-zinc-200"
                  size={20}
                />
              )}
            </button>
            <Drawer>
              <DrawerTrigger asChild>
                <Bookmark size={20} />
              </DrawerTrigger>
              <DrawerContent className="transition-transform duration-300 ease-out mx-2 rounded-[35px] rounded-t-3xl bg-white/90 backdrop-blur-[10px] overflow-x-hidden dark:bg-zinc-800/70 border-0 flex flex-col p-5 pt-3">
                <FavoritesList />
              </DrawerContent>
            </Drawer>
          </div>
        </div>
        <div
          className={`sticky ${AppData.device_info.operate_type == "PWA" ? "top-9" : "top-0"} p-3 z-20 flex flex-col px-0`}
        >
          <div className="flex flex-col gap-3">
            <SearchBox
              isOpen={openSearch}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
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
            <EmptyState />
          ) : (
            <>
              {displayedNews.map((news, index) => (
                <NewsItem key={index} news={news} onViewDetails={setUrl} />
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
