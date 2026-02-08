"use client";

import Editor from "@/components/editer";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { API_BASE_URL, apiFetch } from "@/services/apiClass";
import { turnOnBackLink } from "@/store/appSlice";
import { getCookie } from "@/utils/getCookie";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export default function AddLysaAnnPage() {
  const dispatch = useDispatch();
  const [isbanner, setIsBanner] = useState(false);
  const [isTop, setIsTop] = useState(false);
  const [html, setHtml] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [link, setLink] = useState("");
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    dispatch(turnOnBackLink("/ann/lysa"));
  });

  const handleAnnUpload = async (e: FormEvent) => {
    e.preventDefault();
    const access_token = getCookie("lyps_access_token");
    const annUploadUrl = `${API_BASE_URL}/v1/lyps/ann/add`;
    const annUpload = new apiFetch(annUploadUrl);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", html);
    formData.append("is_banner", isbanner ? "true" : "false");
    formData.append("is_top", isTop ? "true" : "false");
    formData.append("category", category);
    formData.append("link", link);
    if (image) {
      formData.append("file", image);
    }

    try {
      const response = await annUpload.POST(formData, true, access_token || "");
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col min-h-dvh bg-sky-50 dark:bg-background">
      <div className="p-10 px-5 pt-20">
        <h1 className="text-2xl font-medium">新增公告</h1>
        <p className="opacity-50">此功能僅限學生會幹部操作。</p>
      </div>
      <div className="grow bg-background dark:bg-blue-300/10 rounded-t-3xl p-5 pb-40">
        <form className="space-y-6" onSubmit={handleAnnUpload}>
          <div className="space-y-3">
            <label htmlFor="title">標題</label>
            <Input
              placeholder="公告的主題大綱"
              id="title"
              type="text"
              className={`dark:bg-sky-300/10 p-4 py-3 text-[14px]`}
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-3">
            <label htmlFor="category">類別</label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full shadow-none rounded-xl bg-hoverbg border-0 dark:bg-sky-300/10">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="活動資訊">活動資訊</SelectItem>
                  <SelectItem value="數位服務">數位服務</SelectItem>
                  <SelectItem value="其他">其他</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-3">
            <label htmlFor="content">內容</label>
            <Editor value={html} onChange={setHtml} />
          </div>
          <div className="font-medium">其他設定</div>
          <div className="flex justify-between">
            <p>廣告</p>
            <Switch
              checked={isbanner}
              onCheckedChange={(e) => setIsBanner(e)}
            />
          </div>
          {isbanner ? (
            <>
              <div className="space-y-3">
                <label htmlFor="image">上傳圖片</label>
                <Input
                  placeholder="選擇您要上傳的圖片"
                  id="image"
                  type="file"
                  className={`dark:bg-sky-300/10 p-4 py-3 text-[14px]`}
                  required
                  onChange={(e) => setImage(e.target.files?.[0] ?? null)}
                />
              </div>
              <div className="space-y-3">
                <label htmlFor="link">連結</label>
                <Input
                  placeholder="Link"
                  id="link"
                  type="text"
                  className={`dark:bg-sky-300/10 p-4 py-3 text-[14px]`}
                  required
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                />
              </div>
            </>
          ) : (
            <div className="flex justify-between">
              <p>公告置頂</p>
              <Switch checked={isTop} onCheckedChange={(e) => setIsTop(e)} />
            </div>
          )}
          <div className="flex w-full justify-between gap-5">
            <Link
              href="/ann/lysa"
              className="bg-zinc-300 dark:bg-zinc-600 rounded-xl p-2 w-full text-center font-medium hover:opacity-50 transition-all"
            >
              返回
            </Link>
            <button
              type="submit"
              className="bg-sky-600 text-white rounded-xl p-2 w-full font-medium hover:opacity-50 transition-all"
            >
              送出
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
