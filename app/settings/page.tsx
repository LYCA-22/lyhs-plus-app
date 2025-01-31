import { ThemeToggle } from "@/components/sidebar/themeToggle";
export default function Page() {
  return (
    <div className="p-5">
      <ul className="list-none">
        <li className="flex items-center justify-between p-2">
          <div className="font-medium ml-1">系統主題</div>
          <div className="rounded-full border border-transparent dark:border-zinc-700">
            <ThemeToggle />
          </div>
        </li>
      </ul>
    </div>
  );
}
