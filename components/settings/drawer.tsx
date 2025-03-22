"use client";
import { useEffect, useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { CaretLeft, X } from "@phosphor-icons/react";
import SettingHome from "./main";
import NotificationPage from "./notification/page";
import ShortcutsPage from "./shortcuts/page";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { updateSystemData } from "@/store/systemSlice";

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
      root?.classList.add("rounded-xl");
      root?.classList.add("scale-90");
    }
  }, [AppData]);

  const closeDrawer = () => {
    const root = document.getElementById("_next");
    root?.classList.remove("scale-90");
    dispatch(updateSystemData({ isSetOpen: false }));
    root?.classList.remove("rounded-xl");
  };

  return (
    <Drawer open={AppData.isSetOpen} onClose={closeDrawer}>
      <DrawerContent className="pt-14 transition-transform duration-300 ease-out pb-5">
        <DrawerHeader className="flex items-center">
          <button
            className="rounded-full hover:bg-hoverbg p-2"
            onClick={page === "" ? closeDrawer : () => setPage("")}
          >
            {page === "" ? <X size={20} /> : <CaretLeft size={20} />}
          </button>
          <DrawerTitle>設定</DrawerTitle>
        </DrawerHeader>
        <div className="overflow-y-auto">
          <PageReturn />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
