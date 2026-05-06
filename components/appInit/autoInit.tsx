import { announcementApi } from "@/services/api/announcements";
import { publicApi } from "@/services/api/public";
import { userApi } from "@/services/api/user";
import { appInitialized, setAppInfo, setDeviceInfo } from "@/store/appSlice";
import { useAppSelector } from "@/store/hook";
import { loadLysaAnns, loadSchoolAnns } from "@/store/newsSlice";
import { store } from "@/store/store";
import { loadUserData } from "@/store/userSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { UAParser } from "ua-parser-js";

export function InitFunction() {
  const dispatch = useDispatch();
  const error = useAppSelector((state) => state.appStatus.app_error);

  useEffect(() => {
    const checkSteps = async () => {
      try {
        await publicApi.getStatus();

        // 2.
        let isLogged = false;

        try {
          const userData = await userApi.getMe();
          dispatch(loadUserData(userData.data));
          isLogged = true;
        } catch (e) {
          console.error(e);
          if (!window.location.pathname.startsWith("/login")) {
            window.location.href = "/login";
            return;
          }
        }

        // 3.
        const schoolAnnData = await announcementApi.getSchoolList();
        dispatch(loadSchoolAnns(schoolAnnData.data));

        // 4.
        const lysaAnnData = await announcementApi.getLysaList();
        dispatch(loadLysaAnns(lysaAnnData.data));

        // 5.
        const version = process.env.NEXT_PUBLIC_APP_VERSION;
        const gitHash = process.env.NEXT_PUBLIC_GIT_HASH;
        dispatch(setAppInfo({ version: version, gitHash: gitHash }));

        // 6.
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
        console.log(store.getState().appStatus);
      } catch (e) {
        console.error(e);
      }
    };

    checkSteps();
  }, [dispatch]);

  return (
    <div
      className={`fixed bottom-10 text-sm p-2 px-3 mx-10 ${error.code ? "bg-red-100 text-red-600 rounded-xl" : "bg-hover"} transition-all duration-300`}
    >
      {error.code && (
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
      )}
    </div>
  );
}
