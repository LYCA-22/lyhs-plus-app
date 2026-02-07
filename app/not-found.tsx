import { House } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <p className="text-4xl mb-5">404</p>
      <h2 className="text-2xl font-bold">找不到頁面</h2>
      <p>無法找到請求的資源</p>
      <Link
        href="/"
        className="flex items-center gap-2 mt-4 px-4 py-2 bg-sky-100 text-sky-700 dark:bg-sky-800 dark:text-sky-200 font-medium rounded-xl hover:opacity-70"
      >
        <House size={20} />
        返回首頁
      </Link>
    </div>
  );
}
