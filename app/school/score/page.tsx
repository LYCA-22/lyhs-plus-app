"use client";
import { apiService } from "@/services/api";
import { useAppSelector } from "@/store/hook";
import { updateSystemData } from "@/store/systemSlice";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

interface ClassList {
  sco4: null;
  clsId: number;
  sco3: null;
  sco6: number;
  hourTot: number;
  sco5: null;
  sco2: null;
  sco1: number;
  stdCname: string;
  stdNo: string;
  hourSum: number;
  credSum: number;
  stdId: number;
  retainM: null;
  id: number;
  seme: number;
  upgrade: string;
  credTot: number;
  subjTot: number;
  subjSum: number;
  credMust: number;
  seat: string;
  stdSemeId: number;
  clsCname: string;
  grade: number;
  syear: number;
  stdSeme1Id: number;
}

export default function Page() {
  const userData = useAppSelector((state) => state.userData);
  const [classList, setClassList] = useState<ClassList[]>([]);
  const [stdName, setStdName] = useState("");
  const [clsCname, setClsCname] = useState("");
  const [stdNo, setStdNo] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (!userData.school_session) return;

    const getClassList = async () => {
      dispatch(
        updateSystemData({
          isLoading: true,
        }),
      );

      if (!userData.school_session) {
        window.alert("找不到用戶資料");
        router.push("/school");
      }
      const classList = await apiService.getClassList(
        userData.school_session,
        userData.JSESSIONID,
        userData.SRV,
      );

      const result = classList.result.dataRows;
      setClassList(result);
      setStdName(result[0].stdCname);
      setClsCname(result[0].clsCname);
      setStdNo(result[0].stdNo);

      dispatch(
        updateSystemData({
          isLoading: false,
        }),
      );
    };

    getClassList();
  }, [
    dispatch,
    userData.school_session,
    userData.JSESSIONID,
    userData.SRV,
    router,
  ]);

  return (
    <div className="w-full flex flex-col items-center justify-center relative pt-5">
      <div className="flex flex-col gap-2 justify-center w-full px-7">
        <h1 className="text-2xl">歡迎使用 LYHS+ 成績系統</h1>
        <h2 className="text-lg font-medium opacity-50">
          {stdName}｜{clsCname}｜{stdNo}
        </h2>
      </div>
      <div className="relative p-5 w-full">
        <ul className="rounded-[30px] bg-zinc-100 dark:bg-zinc-900 flex flex-col w-full overflow-hidden">
          {classList.map((item, index) => (
            <div
              key={index}
              className="border-b border-zinc-200 dark:border-borderColor last:border-0"
            >
              <li
                aria-label={`${index}-1`}
                className="py-3 px-5 hover:bg-hoverbg transition-all border-b border-zinc-200 dark:border-borderColor flex justify-between items-center"
              >
                <Link
                  href={`/school/score/${item.syear}-1`}
                  className="flex justify-between items-center w-full"
                >
                  <p>{item.clsCname} 第一學期</p>
                  <ChevronRight
                    size={25}
                    strokeWidth={2}
                    className="text-zinc-600 dark:text-zinc-500"
                  />
                </Link>
              </li>
              <li
                aria-label={`${index}-2`}
                className="py-3 px-5 hover:bg-hoverbg transition-all border-b border-zinc-200 dark:border-borderColor last:border-0 flex justify-between items-center"
              >
                <Link
                  href={`/school/score/${item.syear}-2`}
                  className="flex justify-between items-center w-full"
                >
                  <p>{item.clsCname} 第二學期</p>
                  <ChevronRight
                    size={25}
                    strokeWidth={2}
                    className="text-zinc-600 dark:text-zinc-500"
                  />
                </Link>
              </li>
            </div>
          ))}
        </ul>
        <button
          onClick={() => {
            window.alert("功能未開放");
          }}
          className="flex justify-between items-center bg-zinc-100 dark:bg-zinc-900 rounded-[30px] w-full px-5 py-3 mt-8"
        >
          <p>高中總成績</p>
          <ChevronRight
            size={25}
            strokeWidth={2}
            className="text-zinc-600 dark:text-zinc-500"
          />
        </button>
      </div>
    </div>
  );
}
