"use client";
import { useState } from "react";
import { apiService } from "@/services/api";
import { icons } from "@/components/icons";
import { CircularProgress } from "@heroui/react";
import { useRouter } from "next/navigation";

export default function Page() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [Class, setClass] = useState("");
  const [number, setNumber] = useState("");
  const [solution, setSolution] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await apiService.addProject(
        name,
        email,
        type,
        title,
        description,
        Class,
        number,
        solution,
      );
      router.push(`/mailbox/success?code=${result.code}`);
    } catch (error) {
      console.error("Failed to create announcement:", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <ul className="list-none">
          <li className="flex flex-col py-6 px-2 border-b border-borderColor mb-5">
            <p className="font-bold text-2xl">個人基本資料</p>
            <p className="text-foreground opacity-50 mt-2">
              此資料皆會由本會幹部妥善保存，只在需要時使用。
            </p>
            <button className="flex items-center gap-2 bg-hoverbg hover:bg-buttonBg transition-all w-fit p-2 px-3 rounded-full text-sm mt-5 font-medium">
              了解我們怎麼處理你的資料
              {icons["linkOut"]()}
            </button>
          </li>
          <li>
            <label className={"ml-2 text-sm font-medium"} htmlFor={"name"}>
              姓名
            </label>
            <div className={"flex relative items-center"}>
              <input
                className={
                  "w-full text-lg bg-background hover:bg-hoverbg border border-borderColor p-2 px-3 rounded-full outline-none ring-inputPrimary ring-0 transition-all focus:bg-background focus:ring-2 focus:border-transparent m-2"
                }
                id="name"
                placeholder={"Name"}
                required={true}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </li>
          <li>
            <label className={"ml-2 text-sm font-medium"} htmlFor={"email"}>
              電子郵件
            </label>
            <div className={"flex relative items-center"}>
              <input
                className={
                  "w-full text-lg bg-background hover:bg-hoverbg border border-borderColor p-2 px-3 rounded-full outline-none ring-inputPrimary ring-0 transition-all focus:bg-background focus:ring-2 focus:border-transparent m-2"
                }
                id="email"
                placeholder={"name@example.com"}
                required={true}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </li>
          <li>
            <label className={"ml-2 text-sm font-medium"} htmlFor={"class"}>
              班級
            </label>
            <div className={"flex relative items-center"}>
              <input
                className={
                  "w-full text-lg bg-background hover:bg-hoverbg border border-borderColor p-2 px-3 rounded-full outline-none ring-inputPrimary ring-0 transition-all focus:bg-background focus:ring-2 focus:border-transparent m-2"
                }
                id="class"
                placeholder={"點擊這裡輸入班級"}
                required={true}
                type="text"
                value={Class}
                onChange={(e) => setClass(e.target.value)}
              />
            </div>
          </li>
          <li>
            <label className={"ml-2 text-sm font-medium"} htmlFor={"number"}>
              座號
            </label>
            <div className={"flex relative items-center"}>
              <input
                className={
                  "w-full text-lg bg-background hover:bg-hoverbg border border-borderColor p-2 px-3 rounded-full outline-none ring-inputPrimary ring-0 transition-all focus:bg-background focus:ring-2 focus:border-transparent m-2"
                }
                id="number"
                placeholder={"點擊這裡輸入座號"}
                required={true}
                type="number"
                min="1"
                max="50"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
              />
            </div>
          </li>
          <li className="flex flex-col py-6 px-2 border-b border-borderColor mb-5">
            <p className="font-bold text-2xl">案件基本資料</p>
            <p className="text-foreground opacity-50 mt-2">
              提供我們進行爭取的依據。
            </p>
          </li>
          <li>
            <label className={"ml-2 text-sm font-medium"} htmlFor={"type"}>
              案件類型
            </label>
            <div className={"flex relative items-center"}>
              <select
                className={
                  "w-full text-lg bg-background hover:bg-hoverbg border border-borderColor p-2 px-3 rounded-full outline-none ring-inputPrimary ring-0 transition-all focus:bg-background focus:ring-2 focus:border-transparent m-2"
                }
                id="type"
                required={true}
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="" disabled>
                  選擇類型
                </option>
                <option value="老師教學意見">老師教學意見</option>
              </select>
            </div>
            <button className="flex justify-start text-sm ml-2 gap-2 py-2 opacity-70 my-2 mt-1 border-b border-borderColor hover:bg-hoverbg">
              點我了解案件類型
              {icons["linkOut"]()}
            </button>
          </li>
          <li>
            <label className={"ml-2 text-sm font-medium"} htmlFor={"title"}>
              案件大綱
            </label>
            <div className={"flex relative items-center"}>
              <input
                className={
                  "w-full text-lg bg-background hover:bg-hoverbg border border-borderColor p-2 px-3 rounded-full outline-none ring-inputPrimary ring-0 transition-all focus:bg-background focus:ring-2 focus:border-transparent m-2"
                }
                id="title"
                placeholder={"點擊這裡開始輸入"}
                required={true}
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </li>
          <li>
            <label
              className={"ml-2 text-sm font-medium"}
              htmlFor={"description"}
            >
              詳細說明
            </label>
            <div className={"flex relative items-center"}>
              <textarea
                className={
                  "w-full text-lg bg-background hover:bg-hoverbg border border-borderColor p-2 px-3 rounded-2xl outline-none ring-inputPrimary ring-0 transition-all focus:bg-background focus:ring-2 focus:border-transparent m-2 min-h-[200px]"
                }
                id="description"
                placeholder={"點擊這裡開始輸入"}
                required={true}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </li>
          <li>
            <label className={"ml-2 text-sm font-medium"} htmlFor={"solution"}>
              你想要的解決方式
            </label>
            <div className={"flex relative items-center"}>
              <textarea
                className={
                  "w-full text-lg bg-background hover:bg-hoverbg border border-borderColor p-2 px-3 rounded-2xl outline-none ring-inputPrimary ring-0 transition-all focus:bg-background focus:ring-2 focus:border-transparent m-2 min-h-[200px]"
                }
                id="solution"
                placeholder={"點擊這裡開始輸入"}
                required={true}
                value={solution}
                onChange={(e) => setSolution(e.target.value)}
              />
            </div>
          </li>
          <li className="relative flex justify-center items-center flex-col">
            <button
              className="flex justify-center items-center bg-foreground text-rootBg p-3 font-medium rounded-full w-full m-2 mt-5 box-border hover:bg-buttonBg hover:text-foreground active:scale-95 transition-all disabled:bg-hoverbg disabled:text-buttonBg"
              disabled={loading}
            >
              {loading ? (
                <CircularProgress
                  color={"default"}
                  size={"sm"}
                  strokeWidth={3}
                />
              ) : (
                "送出"
              )}
            </button>
            <p className="text-sm opacity-50 mt-1 mb-5">
              若您按下送出，即同意我們的<strong>隱私權政策</strong>與
              <strong>服務條款</strong>
            </p>
          </li>
        </ul>
      </form>
    </div>
  );
}
