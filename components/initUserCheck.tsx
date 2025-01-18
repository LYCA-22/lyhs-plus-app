"use client";
import { useEffect } from "react";
import { store } from "@/store/store";
import { checkUserSession } from "@/utils/userCheck";

export default function UserCheck() {
  useEffect(() => {
    checkUserSession(store.dispatch);
  }, []);

  return <></>;
}
