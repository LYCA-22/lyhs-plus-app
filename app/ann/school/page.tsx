"use client";
import React, { useMemo, useState, useRef, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { EmptyState, NewsItem, SearchBox } from "@/components/news/module";
import { turnOffBackLink } from "@/store/appSlice";
import Link from "next/link";
import { Info, Settings2 } from "lucide-react";
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
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();

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
    <div className={`bg-sky-50 dark:bg-background`}>
      <div className="p-5 flex items-center px-5 justify-between">
        <div className="flex items-center gap-3">
          <div className="relative pb-2">
            <h1 className={`text-2xl font-medium`}>校園公告</h1>
            <div className="bg-sky-600 rounded-full absolute bottom-0 w-full h-1"></div>
          </div>
          <div className="relative pb-2">
            <Link href={"./lysa"} className={`text-2xl font-medium opacity-50`}>
              學生會公告
            </Link>
          </div>
        </div>
      </div>
      <div className="rounded-xl bg-zinc-200 dark:bg-blue-400/20 flex gap-2 text-sm items-center mx-5 mb-5 p-2 pr-2.5">
        <Info size={18} className="w-10" />
        <p>所有公告皆來自學校官網，如有問題請聯絡該處室。</p>
      </div>
      <div className="bg-background dark:bg-blue-300/10 border-t border-border grow">
        <div className="sticky top-0 z-20 bg-white/50 dark:bg-zinc-800/30 backdrop-blur-md  dark:border-zinc-700 overflow-x-auto flex items-center overflow-y-hidden border-b border-border scrollbar-hide px-4 mb-2">
          <div className="mr-2 h-8 w-8 items-center justify-center relative flex text-sm rounded-full bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300">
            <Settings2 size={18} className="w-8" />
          </div>
          {departments.map((dept, index) => (
            <button
              key={index}
              onClick={() => setSelectedDepartment(dept)}
              className={`flex items-center justify-center relative p-3 rounded-xl whitespace-nowrap transition-all ${selectedDepartment == dept ? "font-bold" : "font-normal"}`}
            >
              {dept === "all" ? "全部" : dept}
              {selectedDepartment === dept && (
                <div className="absolute bottom-0 w-10/12 h-[3px] bg-foreground rounded-full"></div>
              )}
            </button>
          ))}
        </div>
        <SearchBox searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <div className="relative w-full">
          {displayedNews.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="relative px-3">
              {displayedNews.map((news, index) => (
                <NewsItem key={index} news={news} />
              ))}
              <div
                ref={observerTarget}
                className="h-10 flex items-center justify-center m-10"
              ></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
