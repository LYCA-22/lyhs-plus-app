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
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
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

      dispatch(
        updateSystemData({
          isLoading: false,
        }),
      );
    };

    getClassList();
  }, [dispatch, userData, router]);

  return (
    <div className="w-full flex flex-col items-center justify-center relative pt-5">
      <div className="flex flex-col gap-2 items-center justify-center">
        <h1 className="text-xl">歡迎，{stdName}</h1>
        <h2 className="text-lg font-medium">請在下方選擇要查詢的學期</h2>
      </div>
      <div className="relative p-5 w-full">
        <ul className="px-5 rounded-2xl bg-hoverbg flex flex-col w-full">
          {classList.map((item, index) => (
            <div
              key={index}
              className="border-b border-borderColor last:border-0"
            >
              <li
                aria-label={`${index}-1`}
                className="py-3 border-b border-borderColor flex justify-between items-center"
              >
                <Link
                  href={`/school/score/detail?year=${item.syear}&seme=1`}
                  className="flex justify-between items-center w-full"
                >
                  <p>
                    {item.clsCname} <strong>第一學期</strong>
                  </p>
                  <ChevronRight
                    size={25}
                    strokeWidth={2}
                    className="text-zinc-600 dark:text-zinc-500"
                  />
                </Link>
              </li>
              <li
                aria-label={`${index}-2`}
                className="py-3 border-b border-borderColor last:border-0 flex justify-between items-center"
              >
                <Link
                  href={`/school/score/detail?year=${item.syear}&seme=2`}
                  className="flex justify-between items-center w-full"
                >
                  <p>
                    {item.clsCname} <strong>第二學期</strong>
                  </p>
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
          className="flex justify-between items-center bg-hoverbg rounded-xl w-full px-5 py-3 my-5"
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
