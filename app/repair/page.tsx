"use client";

import { apiService } from "@/services/api";
import { updateSystemData } from "@/store/systemSlice";
import { Check, CircleFadingArrowUp } from "lucide-react";
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

  return (
    <div className="container mx-auto px-8 py-8 max-w-2xl pb-28">
      {success && (
        <div className="z-10 absolute flex items-center gap-2 top-0 left-0 w-full bg-green-100/90 backdrop-blur-sm dark:bg-green-800/50 dark:text-white/80 font-medium text-green-700 px-4 py-3">
          <Check size={22} />
          <span>報修申請已成功提交！</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-lg font-medium text-foreground mb-2"
          >
            <p>標題</p>
            <p className="text-sm opacity-50 font-normal">
              請填寫您要提交的標題
            </p>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className={
              "w-full text-lg bg-hoverbg border-borderColor p-2 px-3 rounded-full outline-none ring-inputPrimary ring-0 transition-all focus:bg-background focus:ring-2 focus:border-transparent"
            }
          />
        </div>

        <div>
          <label
            htmlFor="category"
            className="block text-lg font-medium text-foreground mb-2"
          >
            <p>類別</p>
            <p className="text-sm opacity-50 font-normal">請選一個此案件類別</p>
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className={
              "appearance-none w-full text-lg bg-hoverbg border-borderColor p-2 px-3 rounded-full outline-none ring-inputPrimary ring-0 transition-all focus:bg-background focus:ring-2 focus:border-transparent"
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
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-lg font-medium text-foreground mb-2"
          >
            <p>詳細描述</p>
            <p className="text-sm opacity-50 font-normal">
              請詳細描述問題，包括何時發現、目前狀況等
            </p>
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            className={
              "appearance-none w-full text-lg bg-hoverbg border-borderColor p-2 px-3 rounded-2xl outline-none ring-inputPrimary ring-0 transition-all focus:bg-background focus:ring-2 focus:border-transparent"
            }
          ></textarea>
        </div>
        <div>
          <label
            htmlFor="image-upload"
            className="block text-lg font-medium text-foreground mb-2"
          >
            <p>設備照片（可選）</p>
            <p className="text-sm opacity-50 font-normal">
              你可以拍攝損壞的地方
            </p>
          </label>
          <div className="relative w-full flex items-center justify-center border-dashed border rounded-2xl border-borderColor py-5">
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="opacity-0 absolute z-0 w-full h-full top-0"
            />
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="p-2 rounded-full bg-hoverbg">
                <CircleFadingArrowUp size={30} />
              </div>
              <p className="text-sm text-foreground z-0">
                {image ? <>{image.name}</> : <>請選擇檔案</>}
              </p>
            </div>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full px-4 py-3 text-white font-medium rounded-full flex items-center justify-center ${
              loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
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
