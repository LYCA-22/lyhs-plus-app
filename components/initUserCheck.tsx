"use client";
import { useEffect } from "react";
import { store } from "@/store/store";
import { useAppSelector } from "@/store/hook";
import { checkUserSession } from "@/utils/userCheck";

export default function UserCheck() {
  const userData = useAppSelector((state) => state.userData);
  useEffect(() => {
    console.log("資料獲取成功：", userData);
  }, [userData]);

  useEffect(() => {
    checkUserSession(store.dispatch);
  }, []);

  return <></>;
}
