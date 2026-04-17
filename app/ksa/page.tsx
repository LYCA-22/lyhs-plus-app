"use client";
import { API_BASE_URL, apiFetch } from "@/services/apiClass";
import {
  setKsaData,
  turnOffBackLink,
  updatePageLoadingStatus,
} from "@/store/appSlice";
import { creditData } from "@/types";
import { getCookie } from "@/utils/getCookie";
import {
  ArrowFromLeftStroke,
  ChartBarBigColumns,
  Check,
  InfoCircle,
  PieChart,
  Sigma,
  SirenAlt,
  User,
  Widget,
} from "@boxicons/react";
import { ChevronRight, Frown, Smile } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IconFile } from "nucleo-glass";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export interface stuData {
  uuid: number;
  stuId: string;
  zhName: string;
  year: number;
  seme: number;
  className: string;
  number: string;
  birthDate: string;
  idCardNumber: number;
  stuPhoneNumber: number;
  autobiography: string;
  address: string;
  regionZip: number;
  stuAuthNo: string;
  created_at: string;
  updated_at: string;
}

export default function KSA() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [stuData, setStuData] = useState<stuData>();
  const [displayCredit, setDisplayCredit] = useState<creditData>();
  const [canGraduate, setCanGraduate] = useState<boolean>(false);
  const access_token = getCookie("lyps_access_token");
  const cookie_sessionKey = getCookie("lyps_ksa_session_key");
  const cookie_SRV = getCookie("lyps_ksa_SRV");
  const cookie_JSESSION = getCookie("lyps_ksa_JSESSIONID");

  useEffect(() => {
    dispatch(turnOffBackLink());
  }, [dispatch]);

  useEffect(() => {
    const fetchStuInfo = async () => {
      dispatch(updatePageLoadingStatus(true));
      try {
        if (!cookie_sessionKey || !cookie_JSESSION || !cookie_SRV) {
          dispatch(updatePageLoadingStatus(false));
          router.push("/ksa/login");
          return;
        } else {
          dispatch(
            setKsaData({
              session_key: cookie_sessionKey,
              JSESSIONID: cookie_JSESSION as string,
              SRV: cookie_SRV as string,
            }),
          );
        }

        // 先獲取學生基本資料
        const stuInfoUrl = `${API_BASE_URL}/v1/lyps/school/basicInfo/${cookie_JSESSION}/${cookie_SRV}`;
        const stuInfo = new apiFetch(stuInfoUrl);
        const result = await stuInfo.GET(
          access_token as string,
          cookie_sessionKey as string,
        );

        // 獲取得到資料，就更新 uuid
        setStuData(result.stuInfo);

        // 再來獲取學分資料
        const creditUrl = `${API_BASE_URL}/v1/lyps/school/allSemeData/${cookie_JSESSION}/${cookie_SRV}/${result.stuInfo.uuid}`;
        const credit = new apiFetch(creditUrl);
        const creditData = (await credit.GET(
          access_token as string,
          cookie_sessionKey as string,
        )) as creditData[];

        // 選擇要作為顯示學分數的陣列
        let displayItem = null;
        if (creditData.length == 1) {
          displayItem = creditData[0];
        } else if (creditData[creditData.length - 1].credAdd) {
          displayItem = creditData[creditData.length - 1];
        } else {
          displayItem = creditData[creditData.length - 2];
        }

        dispatch(
          setKsaData({
            uuid: result.stuInfo.uuid,
            stu_credit: creditData,
            stu_info: [result.stuInfo],
            stu_credit_final: [displayItem],
          }),
        );
        setDisplayCredit(displayItem);
        if (
          (displayItem.credAdd as number) >= 150 &&
          (displayItem.credAddElect as number) >= 40 &&
          (displayItem.credAddMust as number) >= 102
        ) {
          setCanGraduate(true);
        }
      } catch (e) {
        console.error(e);
        dispatch(setKsaData({ SRV: "", JSESSIONID: "", session_key: "" }));
      }
      dispatch(updatePageLoadingStatus(false));
    };
    fetchStuInfo();
  }, [
    cookie_JSESSION,
    cookie_SRV,
    cookie_sessionKey,
    dispatch,
    access_token,
    router,
  ]);

  const KsaLogOut = async () => {
    dispatch(
      setKsaData({
        session_key: "",
        JSESSIONID: "",
        SRV: "",
      }),
    );

    document.cookie = `lyps_ksa_session_key=; path=/;`;
    document.cookie = `lyps_ksa_JSESSIONID=; path=/;`;
    document.cookie = `lyps_ksa_SRV=; path=/;`;

    router.push("/ksa/login");
  };

  const quickBtnClass =
    "flex justify-center p-3 items-center gap-2 bg-buttonBg rounded-2xl w-fit hover:opacity-80 transition-all active:scale-95";

  return (
    <div className={`flex flex-col gap-4 pb-36 p-5 relative`}>
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold">你好，{stuData?.zhName}</h1>
        <button
          className="ml-auto bg-buttonBg rounded-2xl p-2"
          onClick={() => KsaLogOut()}
        >
          <ArrowFromLeftStroke />
        </button>
      </div>
      <h3 className="font-medium text-lg">所有功能</h3>
      <div className="w-full overflow-x-auto">
        <div className="font-medium flex items-center gap-4 justify-between w-fit whitespace-nowrap">
          <Link
            href={"/ksa/score"}
            className={`${quickBtnClass} bg-primary text-white dark:text-black`}
          >
            <ChartBarBigColumns />
            成績查詢
          </Link>
          <Link href={"/ksa/credit"} className={quickBtnClass}>
            <PieChart />
            學分資料
          </Link>
          <Link href={"/ksa/absence"} className={quickBtnClass}>
            <Widget />
            曠課查詢
          </Link>
          <Link href={"/ksa/profile"} className={quickBtnClass}>
            <User />
            個人資料
          </Link>
        </div>
      </div>
      <h3 className="font-medium text-lg">我的檔案</h3>
      <div className="p-5 rounded-2xl relative bg-buttonBg">
        <Link
          href={"/ksa/credit"}
          className="p-2 bg-background dark:bg-sky-300/10 rounded-xl absolute top-5 right-5"
        >
          <ChevronRight />
        </Link>
        <div className="space-y-2">
          <h2 className="text-xl font-medium">{stuData?.zhName}</h2>
          <p>學分加總</p>
          <div className="flex items-center gap-2">
            <Sigma />
            <p className="font-medium text-3xl">
              {displayCredit?.credAdd}
              <span className="text-base opacity-50 mx-2">/ 182</span>
            </p>
          </div>
        </div>
      </div>
      <h3 className="font-medium text-lg">畢業標準檢測</h3>
      <div>
        <div className="flex items-center gap-3 dark:bg-sky-800 dark:text-white bg-sky-100 text-sky-800 rounded-2xl p-3">
          {canGraduate ? (
            <>
              <Smile />
              <p className="font-medium text-xl">恭喜，您可以畢業了！</p>
            </>
          ) : (
            <>
              <Frown />
              <p className="font-medium text-xl">非常遺憾，您目前還不能畢業</p>
            </>
          )}
        </div>
        <div className="flex flex-col items-center overflow-x-auto w-full gap-4 py-4">
          <div className="w-full space-y-2 border-b pb-4">
            <div className="flex items-center gap-4">
              {(displayCredit?.credAdd as number) >= 150 ? (
                <Check className="text-green-600" />
              ) : (
                <SirenAlt className="text-red-600" />
              )}
              <h3 className="text-2xl opacity-50">總學分數</h3>
              <p className="font-medium text-3xl space-x-2">
                <span>{displayCredit?.credAdd}</span>
                <span className="text-lg opacity-50">/ 150</span>
              </p>
            </div>
            {(displayCredit?.credAdd as number) < 150 && (
              <div className="flex items-center gap-2 bg-red-100 dark:bg-red-950 rounded-2xl p-2 px-4 text-red-600 font-medium">
                <InfoCircle size="sm" />
                <p>
                  還缺 {150 - ((displayCredit?.credAdd as number) || 0)} 學分
                </p>
              </div>
            )}
          </div>
          <div className="w-full space-y-2 border-b pb-4">
            <div className="flex items-center gap-4">
              {(displayCredit?.credAddMust as number) >= 102 ? (
                <Check className="text-green-600" />
              ) : (
                <SirenAlt className="text-red-600" />
              )}
              <h3 className="text-2xl opacity-50">必修學分</h3>
              <p className="font-medium text-3xl space-x-2">
                <span>{displayCredit?.credAddMust}</span>
                <span className="text-lg opacity-50">/ 102</span>
              </p>
            </div>
            {(displayCredit?.credAddMust as number) < 102 && (
              <div className="flex items-center gap-2 bg-red-100 dark:bg-red-950 rounded-2xl p-2 px-4 text-red-600 font-medium">
                <InfoCircle size="sm" />
                <p>
                  還缺 {102 - ((displayCredit?.credAddMust as number) || 0)}{" "}
                  學分
                </p>
              </div>
            )}
          </div>
          <div className="w-full space-y-2 border-b pb-4">
            <div className="flex items-center gap-4">
              {(displayCredit?.credAddElect as number) >= 40 ? (
                <Check className="text-green-600" />
              ) : (
                <SirenAlt className="text-red-600" />
              )}
              <h3 className="text-2xl opacity-50">選修學分</h3>
              <p className="font-medium text-3xl space-x-2">
                <span>{displayCredit?.credAddElect}</span>
                <span className="text-lg opacity-50">/ 40</span>
              </p>
            </div>
            {(displayCredit?.credAddElect as number) < 40 && (
              <div className="flex items-center gap-2 bg-red-100 dark:bg-red-950 rounded-2xl p-2 px-4 text-red-600 font-medium">
                <InfoCircle size="sm" />
                <p>
                  還缺 {40 - ((displayCredit?.credAddElect as number) || 0)}{" "}
                  學分
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="p-5 px-7 rounded-2xl relative bg-buttonBg flex flex-col items-center justify-center gap-2 text-center">
        <IconFile size={40} />
        <h3 className="font-medium text-lg">
          請假模擬
          <span className="m-1 rounded-full bg-background px-2 text-sm p-1">
            測試版
          </span>
        </h3>
        <p className="opacity-50">目前僅提供部分班級使用，功能仍在測試中。</p>
        {stuData?.className === "高三仁" ? (
          <>
            <p className="font-medium">
              您的班級為高三仁，因此你有使用權。請點擊下方按鈕前往使用。
            </p>
            <Link
              href={"/ksa/absent"}
              className="flex items-center font-medium p-2 px-4 gap-4 bg-background dark:bg-sky-300/10 rounded-xl"
            >
              前往
              <ChevronRight />
            </Link>
          </>
        ) : (
          <p className="font-medium">非常抱歉，您的班級暫不支援此功能。</p>
        )}
      </div>
      <div className="text-center opacity-50 space-y-2 px-5">
        <h3 className="font-medium text-lg">
          此程式並非教育局製作，請妥善使用。
        </h3>
        <p className="text-sm">
          當您能夠正常在LYHS
          Plus平台上進行登入，即代表您已啟用KSA服務，並同意我們的 KSA
          服務使用者條款。
        </p>
      </div>
    </div>
  );
}
