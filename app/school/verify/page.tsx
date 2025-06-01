"use client";

import { apiService } from "@/services/api";
import { updateSystemData } from "@/store/systemSlice";
import { updateUserData } from "@/store/userSlice";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export default function Page() {
  const dispatch = useDispatch();
  const [src, setSrc] = useState("");
  const [srv, setSrv] = useState("");
  const [jsessionId, setJsessionId] = useState("");
  const [userInput, setUserInput] = useState("");
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    dispatch(
      updateSystemData({
        isBack: true,
        BackLink: "/",
      }),
    );
  });

  const getCode = async () => {
    const data = await apiService.getSchoolSystemCode();
    setSrc(data.src);
    setSrv(data.SRV);
    setJsessionId(data.JSEESIONID);
  };

  useEffect(() => {
    getCode();
  }, []);

  const StartLogin = async (e: FormEvent) => {
    e.preventDefault();
    dispatch(
      updateSystemData({
        isLoading: true,
      }),
    );
    const result = await apiService.getSessionKey(
      account,
      password,
      userInput,
      jsessionId,
      srv,
    );

    if (result.session_key) {
      dispatch(
        updateUserData({
          school_session: result.session_key,
          JSESSIONID: jsessionId,
          SRV: srv,
        }),
      );
      setTimeout(() => {
        dispatch(
          updateSystemData({
            isLoading: false,
          }),
        );
      });

      router.push("/school/score");
    } else {
      setTimeout(() => {
        dispatch(
          updateSystemData({
            isLoading: false,
          }),
        );
      });

      window.alert(`發生不明錯誤（可能資料錯誤）`);
      getCode();
      setAccount("");
      setPassword("");
      setUserInput("");
    }
  };

  return (
    <div className="w-full p-5">
      <div className="flex flex-col items-center justify-center gap-4 mb-9">
        <h1 className="text-xl">請輸入下圖顯示的驗證碼</h1>
        {src ? (
          <Image src={src} width={120} height={22} alt="code"></Image>
        ) : (
          <div>載入中</div>
        )}
      </div>
      <div className="w-full flex flex-col items-center justify-center p-3 my-3 relative border-t border-borderColor">
        <form onSubmit={StartLogin}>
          <p className="mr-auto my-2 opacity-50 text-sm">請輸入重要資訊</p>
          <input
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="請輸入驗證碼"
            required
            className="rounded-t-xl rounded-b-none bg-hoverbg p-3 focus:ring-0 outline-0 border-b border-borderColor w-full"
          ></input>
          <input
            value={account}
            onChange={(e) => setAccount(e.target.value)}
            placeholder="請輸入帳號"
            required
            className="bg-hoverbg rounded-none p-3 focus:ring-0 outline-0 border-b border-borderColor w-full"
          ></input>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="請輸入密碼"
            required
            type="password"
            className="rounded-b-xl rounded-t-none bg-hoverbg p-3 focus:ring-0 outline-0 w-full"
          ></input>
          <button className="dark:bg-foreground bg-sky-950 text-background p-3 rounded-xl my-5 w-full">
            繼續
          </button>
        </form>
      </div>
    </div>
  );
}
