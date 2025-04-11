"use client";

import { useAppDispatch } from "@/store/hook";
import { updateSystemData } from "@/store/systemSlice";
import { useEffect } from "react";

export default function Page() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      updateSystemData({
        isBack: true,
        BackLink: "/",
      }),
    );
  });

  return (
    <div className="w-full h-full relative">
      <iframe
        className="w-full h-full"
        src="https://www.ly.kh.edu.tw/view/index.php?WebID=336"
      ></iframe>
    </div>
  );
}
