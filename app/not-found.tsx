import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl font-bold">找不到頁面</h2>
      <p>無法找到請求的資源</p>
      <Link
        href="/"
        className="mt-4 px-4 py-2 bg-foreground font-medium text-background rounded-full hover:opacity-70"
      >
        返回首頁
      </Link>
    </div>
  );
}
