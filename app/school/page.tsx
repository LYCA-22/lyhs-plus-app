"use client";
import { useAppSelector } from "@/store/hook";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const router = useRouter();
  const userData = useAppSelector((state) => state.userData);

  useEffect(() => {
    if (userData.school_session) router.push("/school/score");
    else router.push("school/login/openId");
  });

  return;
}
