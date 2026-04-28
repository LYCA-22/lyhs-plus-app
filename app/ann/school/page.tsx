"use client";
import React, { useMemo, useState, useRef, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { EmptyState, NewsItem, SearchBox } from "@/components/news/module";
import { turnOffBackLink } from "@/store/appSlice";
import Link from "next/link";
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
  const AppData = useAppSelector((state) => state.appStatus);
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
    <div
      className={`bg-hoverbg min-h-dvh dark:bg-background ${AppData.device_info.operate_type === "PWA" ? "pt-10" : ""}`}
    >
      <div className="p-5 flex items-center px-5 justify-between">
        <div className="flex items-center gap-3">
          <div className="relative bg-primary rounded-full text-background p-2 px-4">
            <h1 className={`text-xl font-medium`}>校園公告</h1>
          </div>
          <div className="relative">
            <Link href={"./lysa"} className={`text-2xl font-medium opacity-50`}>
              學生會公告
            </Link>
          </div>
        </div>
      </div>
      <div className="grow">
        <SearchBox searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <div
          className={`sticky z-20 overflow-x-auto flex items-center overflow-y-hidden scrollbar-hide px-4 my-4 gap-2`}
        >
          {departments.map((dept, index) => (
            <button
              key={index}
              onClick={() => setSelectedDepartment(dept)}
              className={`flex items-center justify-center relative p-2 px-4 rounded-full whitespace-nowrap transition-all ${selectedDepartment == dept ? "bg-foreground text-background" : "text-foreground border"}`}
            >
              {dept === "all" ? "全部" : dept}
            </button>
          ))}
        </div>

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
