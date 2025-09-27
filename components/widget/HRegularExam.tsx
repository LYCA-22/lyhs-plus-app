import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

interface link {
  title: string;
  url: string;
}

interface LearnSource {
  title: string;
  description: string;
  tag: string;
  link: link[];
}

const learnSources: LearnSource[] = [
  {
    title: "LTrust",
    description:
      "這是一款由龍騰文化專為學生推出的 AI 線上學習工具。主打功能包含AI解題、刷題功能。現正處於推廣期間，服務可免費使用！",
    tag: "AI",
    link: [
      {
        title: "前往使用",
        url: "https://ltrust.tw/",
      },
      {
        title: "了解更多",
        url: "https://stu.ltrust.tw",
      },
    ],
  },
  {
    title: "AILead",
    description:
      "AILead 是一個雲端學院，有各個科目的上課影片。如果上課聽不懂，回家可以再看這些影片複習、鞏固觀念！帳號請輸入學號，密碼請輸入身分證後四碼。",
    tag: "影片資源",
    link: [
      {
        title: "前往使用",
        url: "https://lykh.ailead365.com/auth/login",
      },
    ],
  },
  {
    title: "吃飽太閒的物理老師",
    description: "這是一個富含物理現象模擬動畫的網站，幫助你理解！",
    tag: "物理",
    link: [
      {
        title: "前往使用",
        url: "https://sites.google.com/view/physicsimulation2/首頁",
      },
    ],
  },
  {
    title: "高中物理線上學習網",
    description:
      "這是由兩位物理老師建立的網站，裡面有老師製作的講義還有解說影片。",
    tag: "物理",
    link: [
      {
        title: "前往使用",
        url: "https://sites.google.com/site/phyelearning/home?authuser=0",
      },
    ],
  },
  {
    title: "英文自學霸",
    description: "由龍騰文化製作的英文自學網站。包含單字、課文等等。",
    tag: "英文",
    link: [
      {
        title: "前往使用",
        url: "https://learninghub.ltedu.com.tw/61001-D8-englishlab/",
      },
    ],
  },
  {
    title: "英文GOGOGO 2.0",
    description: "由龍騰文化製作的英文單字課文APP，可下載字彙王、課本資源。",
    tag: "英文",
    link: [
      {
        title: "IOS 下載",
        url: "https://apps.apple.com/tw/app/%E8%8B%B1%E6%96%87gogogo-2-0/id6499292760",
      },
      {
        title: "ANDROID 下載",
        url: "https://play.google.com/store/apps/details?id=ltedu.com.NewGoGoGo&hl=zh_TW",
      },
    ],
  },
];

export default function HRegularExam() {
  const [displayType, setDisplayType] = useState("全部");
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // 動態獲取所有唯一的標籤
  const getUniqueCategories = () => {
    const categories = learnSources.map((source) => source.tag);
    return [...new Set(categories)].filter(Boolean); // 移除空值
  };

  const categories = getUniqueCategories();

  useEffect(() => {
    const calculateTimeLeft = () => {
      const regularExamDate = new Date("2025-10-14T00:00:00");
      const difference = +regularExamDate - +new Date();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="m-2 shadow-lg border-2 border-border shadow-hoverbg rounded-3xl overflow-hidden mb-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-medium text-lg">高中部第一次段考</h1>
          <p className="text-sm opacity-50">115年10月14~16日</p>
        </div>
        <p className="border-b-2 border-inputPrimary">
          考試倒數
          <span className="text-[28px] font-bold font-mono text-inputPrimary mx-2">
            {timeLeft.days}
          </span>
          天
        </p>
      </div>
      <div className="space-y-2 pt-5">
        <div className="flex items-center gap-3">
          <Link href={"/"} className="bg-hoverbg p-2 px-3 rounded-full">
            段考考程、範圍
          </Link>

          <Drawer>
            <DrawerTrigger asChild>
              <div className="bg-hoverbg p-2 px-3 rounded-full hover:opacity-50">
                學習資源
              </div>
            </DrawerTrigger>
            <DrawerContent className="transition-transform duration-300 ease-out mx-2 rounded-[35px] rounded-t-3xl bg-white/90 backdrop-blur-[10px] overflow-x-hidden dark:bg-zinc-800/70 border-0 flex flex-col">
              <div className="flex flex-col items-center justify-between bg-white/0 p-2 gap-4 sticky top-0">
                <div className="h-1 bg-borderColor w-10 rounded-full"></div>
                <DrawerTitle className="text-lg">段考學習資源</DrawerTitle>
              </div>
              <div className="px-4 mb-4 items-center flex gap-2 overflow-y-auto w-full whitespace-nowrap">
                <p className="ml-2 opacity-50">類別</p>
                <button
                  onClick={() => setDisplayType("全部")}
                  className={`p-2 px-3 rounded-full border border-borderColor ${displayType === "全部" ? "bg-primary text-background" : "text-foreground"}`}
                >
                  全部
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setDisplayType(category)}
                    className={`p-2 px-3 rounded-full border border-borderColor ${displayType === category ? "bg-primary text-background" : "text-foreground"}`}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <div className="p-5 pt-0 max-h-[600px] overflow-y-auto">
                <ol className="space-y-3">
                  {learnSources
                    .filter(
                      (item) =>
                        displayType === "全部" || item.tag === displayType,
                    )
                    .map((item, index) => (
                      <li
                        key={index}
                        className="bg-background rounded-3xl p-4 space-y-2"
                      >
                        <div className="flex items-center gap-2">
                          <div className="bg-inputPrimary flex items-center justify-center w-8 h-8 rounded-full text-white">
                            {index + 1}
                          </div>
                          <h3 className="text-lg font-medium">{item.title}</h3>
                          {item.tag && (
                            <span className="text-sm bg-hoverbg rounded-full px-2">
                              {item.tag}
                            </span>
                          )}
                        </div>
                        <p className="font-medium">{item.description}</p>
                        <div className="flex items-center gap-3">
                          {item.link.map((link, index) => (
                            <Link
                              key={index}
                              href={link.url}
                              target="_blank"
                              className="bg-hoverbg bg-opacity-50 border-2 border-borderColor font-medium text-foreground p-2 px-3 rounded-full"
                            >
                              {link.title}
                            </Link>
                          ))}
                        </div>
                      </li>
                    ))}
                </ol>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </div>
  );
}
