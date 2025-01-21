"use client";
import { useAppSelector } from "@/store/hook";
import { NewView } from "@/components/newView";

export default function Page() {
  const NewsData = useAppSelector((state) => state.newsData.announcements);

  return (
    <div className="relative">
      {NewsData.map((news, index) => (
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
      ))}
    </div>
  );
}
