import { useAppSelector } from "@/store/hook";
import { CaretLeft } from "@phosphor-icons/react";
import Link from "next/link";

export function DynamicBack() {
  const AppData = useAppSelector((state) => state.systemData);

  if (AppData.isBack) {
    return (
      <Link href={AppData.BackLink}>
        <CaretLeft size={22} className="text-primary" weight="bold" />
      </Link>
    );
  }
}
