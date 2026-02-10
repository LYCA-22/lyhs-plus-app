"use client";
import { turnOffBackLink } from "@/store/appSlice";
import { useAppSelector } from "@/store/hook";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function KSA() {
  const appData = useAppSelector((state) => state.appStatus);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(turnOffBackLink());
    if (!appData.ksa_cookies.session_key) {
      router.push("/ksa/login");
    }
  }, [appData.ksa_cookies.session_key, router, dispatch]);

  return <div>KSA服務</div>;
}
