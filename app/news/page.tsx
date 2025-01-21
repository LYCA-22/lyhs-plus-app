"use client";
import { useMemo, useState } from "react";
import { useAppSelector } from "@/store/hook";
import { NewView } from "@/components/newView";

export default function Page() {
  const NewsData = useAppSelector((state) => state.newsData.announcements);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

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

  return (
    <div className="relative w-full max-sm:w-screen">
      <div className="sticky top-0 bg-background border-b p-4 z-10 flex flex-col">
        <div className="flex flex-col gap-3">
          <p className="text-2xl mx-1 my-2 font-medium">校園公告</p>
          {/* 搜尋欄 */}
          <input
            type="text"
            placeholder="搜尋公告..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 px-4 border rounded-full w-full"
          />

          {/* 部門選擇 */}
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

      {/* 公告列表 */}
      <div className="relative">
        {filteredNews.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            沒有符合條件的公告
          </div>
        ) : (
          filteredNews.map((news, index) => (
            <div
              key={index}
              className="border-b flex flex-col box-border p-5 px-6 border-borderColor"
            >
              <div className="flex items-center mb-1">
                <p className="m-1 ml-0 h-[35px] w-[35px] flex justify-center items-center rounded-full font-medium text-sm bg-foreground text-background">
                  {news.department[0]}
                </p>
                <p className="m-1 font-medium">{news.department}</p>
              </div>
              <div className="flex flex-col">
                <h2 className="text-lg font-semibold flex">{news.title}</h2>
                <NewView>
                  <iframe
                    src={news.link}
                    className="w-full h-full"
                    title={news.title}
                  ></iframe>
                </NewView>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
