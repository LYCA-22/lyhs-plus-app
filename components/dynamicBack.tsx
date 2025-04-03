import { useAppSelector } from "@/store/hook";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export function DynamicBack() {
  const AppData = useAppSelector((state) => state.systemData);

  if (AppData.isBack) {
    return (
      <Link href={AppData.BackLink}>
        <ChevronLeft size={22} strokeWidth={3} className="text-primary" />
      </Link>
    );
  }
}
