"use client";

import { apiService } from "@/services/api";
import { useAppSelector } from "@/store/hook";
import { updateSystemData } from "@/store/systemSlice";
import { Check, ArrowUpFromLine, ChevronDown, ScanLine } from "lucide-react";
import { FormEvent, useState, ChangeEvent, useEffect } from "react";
import { useDispatch } from "react-redux";

export default function Page() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const dispatch = useDispatch();
  const UserData = useAppSelector((state) => state.userData);
  const isPwa = useAppSelector((state) => state.systemData.isPwa);

  useEffect(() => {
    dispatch(
      updateSystemData({
        isBack: true,
        BackLink: "/",
      }),
    );
  });

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    if (image) {
      formData.append("image", image);
    }
    if (UserData.name) {
      formData.append("reward", UserData.name);
    } else {
      formData.append("reward", "");
    }

    try {
      await apiService.addRepair(formData);
      setTitle("");
      setDescription("");
      setCategory("電子設備");
      setImage(null);
      setSuccess(true);

      // 重置文件輸入
      const fileInput = document.getElementById(
        "image-upload",
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (error) {
      console.error("Error:", error);
      alert("提交失敗，請稍後再試");
    } finally {
      setLoading(false);
    }
  };

  const textClass =
    "w-full text-lg border-borderColor bg-transparent p-2 focus:ring-0 px-3 rounded-xl outline-0 focus:border-2 focus:border-inputPrimary focus:ring-transparent border";

  return (
    <div className="container mx-auto px-8 pt-5 max-w-2xl pb-40">
      {success && (
        <div className="z-10 absolute flex items-center gap-2 top-0 left-0 w-full bg-green-100/90 backdrop-blur-sm dark:bg-green-800/50 dark:text-white/80 font-medium text-green-700 px-4 py-3">
          <Check size={22} />
          <span>報修申請已成功提交！</span>
        </div>
      )}
      <div className="fixed top-0 z-[5000] right-5 pt-deviceTop">
        <button>
          <ScanLine className="opacity-50 mt-1" size={22}></ScanLine>
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-[16px] font-medium text-foreground mb-2"
          >
            <p>大綱</p>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className={textClass}
          />
        </div>

        <div>
          <label
            htmlFor="category"
            className="block text-[16px] font-medium text-foreground mb-2"
          >
            <p>類別</p>
          </label>
          <div className="flex items-center relative">
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className={
                "appearance-none z-10 bg-transparent w-full text-[18px] border-borderColor border p-3 px-4 rounded-xl outline-none focus:border-2 focus:border-inputPrimary"
              }
            >
              <option value={""} disabled>
                請選擇
              </option>
              <option value="班級電子設備">班級電子設備</option>
              <option value="飲水機">飲水機</option>
              <option value="冷氣">冷氣</option>
              <option value="電子白板 / 投影機">電子白板 / 投影機</option>
              <option value="運動設施">運動設施</option>
              <option value="其他">其他</option>
            </select>
            <ChevronDown className="opacity-50 absolute right-5 z-0"></ChevronDown>
          </div>
        </div>
        <div>
          <label
            htmlFor="location"
            className="block text-[16px] font-medium text-foreground mb-2"
          >
            <p>位置</p>
          </label>
          <input id="location" type="text" required className={textClass} />
        </div>
        <div>
          <label
            htmlFor="description"
            className="block text-[16px] font-medium text-foreground mb-2"
          >
            <p>詳細描述</p>
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            className={textClass}
          ></textarea>
        </div>
        <div>
          <label
            htmlFor="image-upload"
            className="block text-[16px] font-medium text-foreground mb-2"
          >
            <p>照片（可選）</p>
          </label>
          <div className="relative w-full border-dashed flex items-center justify-center border rounded-xl border-borderColor py-7">
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="opacity-0 absolute z-0 w-full h-full top-0 cursor-pointer"
            />
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="opacity-55">
                <ArrowUpFromLine size={25} />
              </div>
              <p className="text-[16px] text-foreground z-0 opacity-55">
                {image ? <>{image.name}</> : <>請選擇檔案</>}
              </p>
            </div>
          </div>
        </div>

        <div
          className={`fixed bottom-0 w-full p-4 px-6 bg-white dark:bg-zinc-800 left-0 shadow-2xl shadow-zinc-800 dark:shadow-zinc-400 flex flex-col items-center justify-center ${isPwa ? "pb-deviceBottom" : ""}`}
        >
          <p className="text-sm opacity-50 mb-2">提交前請再次確認資料無誤</p>
          <button
            type="submit"
            disabled={loading}
            className={`w-full px-4 py-3 text-white font-medium rounded-xl flex items-center justify-center ${
              loading ? "bg-gray-400" : "bg-sky-800 hover:bg-sky-700"
            } focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200`}
          >
            {loading ? (
              <div className="border-2 border-white/50 border-t-white animate-spin h-6 w-6 rounded-full" />
            ) : (
              "提交報修"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
