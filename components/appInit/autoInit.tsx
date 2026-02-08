import { API_BASE_URL, apiFetch } from "@/services/apiClass";
import { appInitialized, setAppInfo, setDeviceInfo } from "@/store/appSlice";
import { useAppSelector } from "@/store/hook";
import { loadLysaAnns, loadSchoolAnns } from "@/store/newsSlice";
import { store } from "@/store/store";
import { loadUserData } from "@/store/userSlice";
import { getCookie } from "@/utils/getCookie";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { UAParser } from "ua-parser-js";

export function InitFunction() {
  const dispatch = useDispatch();
  const [userText, setUserText] = useState("系統初始化");
  const error = useAppSelector((state) => state.appStatus.app_error);

  useEffect(() => {
    const checkSteps = async () => {
      try {
        // 1.
        setUserText("正在取得伺服器狀態");
        const serverCheckApiUrl = `${API_BASE_URL}/v1/status`;
        const serverCheck = new apiFetch(serverCheckApiUrl);
        await serverCheck.GET();

        // 2.
        setUserText("取得學校網站公告中");
        const getSchoolAnnUrl = `${API_BASE_URL}/v1/lyps/list`;
        const getSchoolAnn = new apiFetch(getSchoolAnnUrl);
        const schoolAnnData = await getSchoolAnn.GET();
        dispatch(loadSchoolAnns(schoolAnnData.data));

        // 3.
        setUserText("取得學生會公告中");
        const getLysaAnnsUrl = `${API_BASE_URL}/v1/lyps/ann/list`;
        const getLysaAnns = new apiFetch(getLysaAnnsUrl);
        const lysaAnnData = await getLysaAnns.GET();
        dispatch(loadLysaAnns(lysaAnnData.data));

        // 4.
        setUserText("檢查是否有用戶憑證");
        const access_token = getCookie("lyps_access_token");
        let isLogged = false;

        if (access_token) {
          setUserText("正在獲取用戶基本資料");
          const getUserDataUrl = `${API_BASE_URL}/v1/user/me`;
          const getUserData = new apiFetch(getUserDataUrl);
          const userData = await getUserData.GET(access_token);
          dispatch(loadUserData(userData.data));
          isLogged = true;
        }

        // 5.
        setUserText("正在進行系統版本確認");
        const version = process.env.NEXT_PUBLIC_APP_VERSION;
        const gitHash = process.env.NEXT_PUBLIC_GIT_HASH;
        dispatch(setAppInfo({ version: version, gitHash: gitHash }));

        // 6.
        setUserText("正在獲取使用者設備資訊");
        const parser = new UAParser();
        const deviceInfo = parser.getResult();

        // 檢測是否是 PWA
        const isStandalone = window.matchMedia?.(
          "(display-mode: standalone)",
        ).matches;
        const isIOSStandalone = (
          navigator as Navigator & { standalone?: boolean }
        ).standalone;

        dispatch(
          setDeviceInfo({
            os: deviceInfo.os.name,
            browser: deviceInfo.browser.name,
            isMobile: deviceInfo.device.type === "mobile",
            operate_type: isStandalone || isIOSStandalone ? "PWA" : "WEB",
          }),
        );

        dispatch(appInitialized(isLogged));
      } catch (e) {
        console.error(e);
      } finally {
        console.log(store.getState().appStatus);
      }
    };

    checkSteps();
  }, [dispatch]);

  return (
    <div
      className={`fixed bottom-10 text-sm p-2 px-3 mx-10 ${error.code ? "bg-red-100 text-red-600 rounded-xl" : "bg-hover"} transition-all duration-300`}
    >
      {error.code ? (
        <div className="flex flex-col gap-2">
          <p className="text-[15px] font-medium">
            應用程式初始化時，發生了錯誤。
          </p>
          <div className="text-[13px] font-normal w-full">
            <p>錯誤代碼：{error.code}</p>
            <p>錯誤訊息：{error.message ? error.message : "無詳細說明。"}</p>
            <p>此為必要錯誤，若仍然無法使用請聯絡學生會人員。</p>
          </div>
        </div>
      ) : (
        <p>{userText}...</p>
      )}
    </div>
  );
}
