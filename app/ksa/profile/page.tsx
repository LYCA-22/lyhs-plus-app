"use client";
import { API_BASE_URL, apiFetch } from "@/services/apiClass";
import { turnOnBackLink } from "@/store/appSlice";
import { useAppSelector } from "@/store/hook";
import { getCookie } from "@/utils/getCookie";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export default function AbsencePage() {
  const dispatch = useDispatch();
  const appData = useAppSelector((state) => state.appStatus);
  const access_token = getCookie("lyps_access_token");
  const [imageData, setImageData] = useState("");
  const stuData = appData.ksa_data.stu_info[0];

  if (!appData.ksa_data.stu_info.length) {
    redirect("/ksa");
  }

  useEffect(() => {
    dispatch(turnOnBackLink("/ksa"));
  }, [dispatch]);

  useEffect(() => {
    const handleFetchImage = async () => {
      if (
        !access_token ||
        !appData.ksa_data.session_key ||
        !appData.ksa_data.JSESSIONID ||
        !appData.ksa_data.SRV
      ) {
        return;
      }
      try {
        // 保持原始的 API 呼叫路徑
        const imageUrl = `${API_BASE_URL}/v1/lyps/school/image/${appData.ksa_data.JSESSIONID}/${appData.ksa_data.SRV}`;
        const imageFetch = new apiFetch(imageUrl);
        const res = await imageFetch.GET(
          access_token as string,
          appData.ksa_data.session_key,
        );

        setImageData(res.stuImageData);
      } catch (e) {
        console.error(e);
      }
    };

    handleFetchImage();
  }, [
    access_token,
    appData.ksa_data.session_key,
    appData.ksa_data.JSESSIONID,
    appData.ksa_data.SRV,
  ]);

  return (
    <div className="flex flex-col bg-hoverbg dark:bg-background h-full pt-10 gap-4">
      <div className="p-5 pt-7 pb-0 space-y-2">
        <h1 className="font-medium text-2xl">個人資料</h1>
      </div>
      <div className="grow bg-background dark:bg-blue-300/10 rounded-t-3xl pb-36 p-5">
        <div className="rounded-xl overflow-hidden border w-fit mb-4">
          <Image src={imageData} alt="Student Image" width={80} height={80} />
        </div>
        <ul>
          <li className="flex justify-between items-center border-b py-2">
            <p>中文姓名</p>
            <p className="text-left">{stuData?.zhName}</p>
          </li>
          <li className="flex justify-between items-center border-b py-2">
            <p>班級座號</p>
            <p className="text-left">
              {stuData?.className} {stuData?.number}號
            </p>
          </li>
          <li className="flex justify-between items-center border-b py-2">
            <p>學號</p>
            <p className="text-left">{stuData?.stuId}</p>
          </li>
          <li className="flex justify-between items-center border-b py-2">
            <p>生日</p>
            <p className="text-left">{stuData?.birthDate}</p>
          </li>
          <li className="flex justify-between items-center border-b py-2">
            <p>身分證號</p>
            <p className="text-left">{stuData?.idCardNumber}</p>
          </li>
          <li className="flex justify-between items-center border-b py-2">
            <p>手機號碼</p>
            <p className="text-left">{stuData?.stuPhoneNumber}</p>
          </li>
          <li className="flex justify-between items-center border-b py-2">
            <p>住址</p>
            <p className="text-left">{stuData?.address}</p>
          </li>
          <li className="flex flex-col  border-b py-2 space-y-2">
            <div>
              <p>自傳</p>
              <p className="opacity-50 text-sm">如需更改請至校務行政系統。</p>
            </div>
            <p className="p-4 rounded-xl bg-buttonBg">
              {stuData?.autobiography}
            </p>
          </li>
          <li className="flex justify-between items-center border-b py-2">
            <p>帳號建立時間</p>
            <p className="text-left">{stuData?.created_at}</p>
          </li>
          <li className="flex justify-between items-center py-2">
            <p>帳號更新時間</p>
            <p className="text-left">{stuData?.updated_at}</p>
          </li>
        </ul>
      </div>
    </div>
  );
}
