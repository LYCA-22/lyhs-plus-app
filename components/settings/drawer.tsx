"use client";
import { useEffect, useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import SettingHome from "./main";
import NotificationPage from "./notification/page";
import ShortcutsPage from "./shortcuts/page";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { updateSystemData } from "@/store/systemSlice";
import { ChevronLeft } from "lucide-react";

export default function SettingsDrawer() {
  const [page, setPage] = useState<string>("");
  const AppData = useAppSelector((state) => state.systemData);
  const dispatch = useAppDispatch();

  const PageReturn = () => {
    if (page === "") {
      return <SettingHome setPageAction={setPage} />;
    } else if (page === "notification") {
      return <NotificationPage />;
    } else if (page === "apps") {
      return <ShortcutsPage />;
    }
  };

  useEffect(() => {
    if (AppData.isSetOpen) {
      const root = document.getElementById("_next");
      root?.classList.add("rounded-3xl");
      root?.classList.add("scale-90");
    }
  }, [AppData]);

  const closeDrawer = () => {
    const root = document.getElementById("_next");
    root?.classList.remove("scale-90");
    dispatch(updateSystemData({ isSetOpen: false }));
    root?.classList.remove("rounded-3xl");
  };

  return (
    <Drawer open={AppData.isSetOpen} onClose={closeDrawer}>
      <DrawerContent className="pt-14 transition-transform duration-300 ease-out pb-5 max-h-dvh rounded-t-[40px]">
        <DrawerHeader className="flex items-center justify-center rounded-t-[40px]">
          {page !== "" && (
            <button
              className="rounded-full hover:bg-buttonBg p-[6px] bg-hoverbg absolute left-4 top-4"
              onClick={() => setPage("")}
            >
              <ChevronLeft size={20} strokeWidth={3} />
            </button>
          )}
          <DrawerTitle>設定</DrawerTitle>
        </DrawerHeader>
        <div className="overflow-y-auto max-h-screen-56">
          <PageReturn />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
