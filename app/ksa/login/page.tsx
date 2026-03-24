"use client";
import {
  setKsaData,
  turnOnBackLink,
  updatePageLoadingStatus,
} from "@/store/appSlice";
import { useAppSelector } from "@/store/hook";
import { FormEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Enableksa } from "./enableKsa";
import { Input } from "@/components/ui/input";
import { ArrowRight, CircleQuestionMark, LogIn, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { API_BASE_URL, apiFetch } from "@/services/apiClass";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { enableKsaService, loadUserData } from "@/store/userSlice";
import { getCookie } from "@/utils/getCookie";
import { useRouter } from "next/navigation";

export default function KSALoginPage() {
  const userData = useAppSelector((state) => state.userData);
  const [openId, setOpenId] = useState<string>("");
  const [openIdPsw, setOpenIdPsw] = useState<string>("");
  const [classId, setClassId] = useState<string>("");
  const [number, setNumber] = useState<string>("");
  const [grade, setGrade] = useState<string>("");
  const [openSearchBox, setOpenSearchBox] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [turnOnQuickLogin, setTurnOnQuickLogin] = useState<boolean>(false);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch(turnOnBackLink("/"));
    const openId = localStorage.getItem("lyps_openId");
    if (openId) {
      setOpenId(openId);
      setRememberMe(true);
    }
  }, [dispatch]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    try {
      dispatch(updatePageLoadingStatus(true));
      const loginUrl = `${API_BASE_URL}/v1/lyps/school/login`;
      const login = new apiFetch(loginUrl);
      const result = await login.POST({ userId: openId, password: openIdPsw });
      dispatch(
        setKsaData({
          SRV: result.SRV,
          JSESSIONID: result.JSESSIONID,
          session_key: result.session_key,
        }),
      );
      document.cookie = `lyps_ksa_session_key=${result.session_key}; path=/; expires=${new Date(Date.now() + 60 * 60 * 8 * 1000).toUTCString()}; SameSite=Strict; Secure`;
      document.cookie = `lyps_ksa_JSESSIONID=${result.JSESSIONID}; path=/; expires=${new Date(Date.now() + 60 * 60 * 8 * 1000).toUTCString()}; SameSite=Strict; Secure`;
      document.cookie = `lyps_ksa_SRV=${result.SRV}; path=/; expires=${new Date(Date.now() + 60 * 60 * 8 * 1000).toUTCString()}; SameSite=Strict; Secure`;
      if (rememberMe) {
        localStorage.setItem("lyps_openId", openId);
      }
      if (turnOnQuickLogin) {
        const access_token = getCookie("lyps_access_token");
        const quickLoginUrl = `${API_BASE_URL}/v1/lyps/school/linkQuickMode`;
        const quickLogin = new apiFetch(quickLoginUrl);
        await quickLogin.PUT((access_token as string) || "", {
          openid_account: openId,
          openid_password: openIdPsw,
        });
        dispatch(enableKsaService());
      }
      dispatch(updatePageLoadingStatus(false));
      router.push("/ksa");
    } catch (e) {
      console.error(e);
    }
  };

  const handleQuickLogin = async () => {
    try {
      dispatch(updatePageLoadingStatus(true));
      const access_token = getCookie("lyps_access_token");
      const quickLoginUrl = `${API_BASE_URL}/v1/lyps/school/quickLogin`;
      const quickLogin = new apiFetch(quickLoginUrl);
      const result = await quickLogin.POST({}, false, access_token as string);
      dispatch(
        setKsaData({
          SRV: result.SRV,
          JSESSIONID: result.JSESSIONID,
          session_key: result.session_key,
        }),
      );
      document.cookie = `lyps_ksa_session_key=${result.session_key}; path=/; expires=${new Date(Date.now() + 60 * 60 * 8 * 1000).toUTCString()}; SameSite=Strict; Secure`;
      document.cookie = `lyps_ksa_JSESSIONID=${result.JSESSIONID}; path=/; expires=${new Date(Date.now() + 60 * 60 * 8 * 1000).toUTCString()}; SameSite=Strict; Secure`;
      document.cookie = `lyps_ksa_SRV=${result.SRV}; path=/; expires=${new Date(Date.now() + 60 * 60 * 8 * 1000).toUTCString()}; SameSite=Strict; Secure`;
      dispatch(updatePageLoadingStatus(false));
      router.push("/ksa");
    } catch (e) {
      console.error(e);
    }
  };

  const handleCloseQuickLogin = async () => {
    try {
      dispatch(updatePageLoadingStatus(true));
      const access_token = getCookie("lyps_access_token");
      const quickLoginUrl = `${API_BASE_URL}/v1/lyps/school/closeQuickMode`;
      const quickLogin = new apiFetch(quickLoginUrl);
      await quickLogin.PUT(access_token as string);
      dispatch(
        loadUserData({
          ...userData,
          openid_account: "",
          openid_password: "",
        }),
      );
      dispatch(updatePageLoadingStatus(false));
    } catch (e) {
      console.error(e);
    }
  };

  const handleSearch = async () => {
    try {
      dispatch(updatePageLoadingStatus(true));
      const searchUrl = `${API_BASE_URL}/v1/lyps/school/idSearch/${grade}/${classId}/${number}`;
      const search = new apiFetch(searchUrl);
      const res = await search.GET();
      setOpenId(res.openid);
      setOpenSearchBox(false);
    } catch (e) {
      console.error("查詢錯誤:", e);
    } finally {
      dispatch(updatePageLoadingStatus(false));
    }
  };

  return (
    <div className="flex flex-col bg-hoverbg dark:bg-background h-full pt-10 gap-4">
      <div className="p-5 pt-7 pb-0 space-y-2">
        <h1 className="font-medium text-2xl">
          {!userData.ksa_enabled ? "啟用服務" : "登入帳號"}
        </h1>
      </div>
      <div className="grow bg-background dark:bg-blue-300/10 rounded-t-3xl pb-36 p-5">
        {!userData.ksa_enabled ? (
          <Enableksa />
        ) : (
          <div className="w-full space-y-2">
            <h2 className="text-lg font-medium mx-2">帳密登入</h2>
            <form className="space-y-5 p-2" onSubmit={handleLogin}>
              <Input
                placeholder="OPENID 帳號"
                className="p-3 dark:bg-sky-300/10"
                value={openId}
                onChange={(e) => setOpenId(e.target.value)}
                required
              />
              <div className="flex items-center w-full gap-4">
                <Input
                  placeholder="OPENID 密碼"
                  type="password"
                  className="p-3 dark:bg-sky-300/10"
                  value={openIdPsw}
                  onChange={(e) => setOpenIdPsw(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="bg-sky-600 text-white px-4 py-3 rounded-xl w-16 h-full"
                >
                  <ArrowRight />
                </button>
              </div>
              <div className="flex items-center gap-2 mt-5">
                {!userData.openid_account && (
                  <>
                    <Checkbox
                      id="checkbox"
                      checked={turnOnQuickLogin}
                      onCheckedChange={() =>
                        setTurnOnQuickLogin(!turnOnQuickLogin)
                      }
                    />
                    <label htmlFor="checkbox">啟用快速登入</label>
                  </>
                )}
                <Checkbox
                  id="rememberAccount"
                  checked={rememberMe}
                  onCheckedChange={() => setRememberMe(!rememberMe)}
                />
                <label htmlFor="rememberAccount">記住帳號</label>
              </div>
              <div className="text-sm space-y-2">
                <p className="opacity-50">
                  如未啟用快速登入者，請先使用帳密登入。
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setOpenSearchBox(true)}
                    className="flex items-center gap-1 font-medium text-sky-600"
                  >
                    <CircleQuestionMark size={18} />
                    <p>忘記帳號</p>
                  </button>
                </div>
                {openSearchBox && (
                  <div className="space-y-2 py-2 border-t border-border dark:border-zinc-500">
                    <p className="text-sm opacity-50">
                      請在下方輸入您的班級、座號，若找到會直接填入帳號欄位。
                    </p>
                    <div className="flex gap-3 relative w-full">
                      <Select value={grade} onValueChange={setGrade}>
                        <SelectTrigger className="w-full shadow-none rounded-xl bg-hoverbg border-0 dark:bg-sky-300/10">
                          <SelectValue placeholder="年級" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3">高一</SelectItem>
                          <SelectItem value="4">高二</SelectItem>
                          <SelectItem value="5">高三</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={classId} onValueChange={setClassId}>
                        <SelectTrigger className="w-full shadow-none rounded-xl bg-hoverbg border-0 dark:bg-sky-300/10">
                          <SelectValue placeholder="班級" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">忠</SelectItem>
                          <SelectItem value="1">孝</SelectItem>
                          <SelectItem value="2">仁</SelectItem>
                          <SelectItem value="3">愛</SelectItem>
                          <SelectItem value="4">信</SelectItem>
                          <SelectItem value="5">義</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        type="text"
                        id="number"
                        placeholder="座號"
                        value={number}
                        onChange={(e) => setNumber(e.target.value)}
                        className=" dark:bg-sky-300/10"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSearch()}
                      className="bg-sky-600 text-white px-4 py-3 rounded-xl w-16 h-full"
                    >
                      查詢
                    </button>
                  </div>
                )}
              </div>
            </form>
            {userData.openid_account && (
              <div className="w-full flex items-center justify-center mt-5 pt-5 border-t border-border dark:border-zinc-600 gap-3">
                <button
                  onClick={() => handleQuickLogin()}
                  className="flex gap-2 items-center justify-center bg-sky-600 text-white rounded-xl p-2 w-full font-medium hover:opacity-50 transition-all"
                >
                  <LogIn size={20} />
                  <p>使用快速登入</p>
                </button>
                <button
                  onClick={() => handleCloseQuickLogin()}
                  className="flex gap-2 items-center justify-center bg-zinc-300 dark:bg-zinc-600 rounded-xl p-2 w-full font-medium hover:opacity-50 transition-all"
                >
                  <X size={20} />
                  <p>關閉快速登入</p>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
