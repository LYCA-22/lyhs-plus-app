import { Checkbox } from "@/components/ui/checkbox";
import { ToggleLeft } from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { UserTerms } from "./terms";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { useDispatch } from "react-redux";
import { updatePageLoadingStatus } from "@/store/appSlice";
import { API_BASE_URL, apiFetch } from "@/services/apiClass";
import { getCookie } from "@/utils/getCookie";
import { enableKsaService } from "@/store/userSlice";

export function Enableksa() {
  const [isOpenQuickLogin, setIsOpenQuickLogin] = useState(false);
  const [openId, setOpenId] = useState("");
  const [openIdPsw, setOpenIdPsw] = useState("");
  const dispatch = useDispatch();

  const handleEnableKsa = async (e: FormEvent) => {
    e.preventDefault();
    try {
      dispatch(updatePageLoadingStatus(true));
      const enableKsaUrl = `${API_BASE_URL}/v1/lyps/school/enable`;
      const enableKsa = new apiFetch(enableKsaUrl);
      const access_token = getCookie("lyps_access_token");
      await enableKsa.PUT(access_token as string);
      if (isOpenQuickLogin) {
        const quickLoginUrl = `${API_BASE_URL}/v1/lyps/school/linkQuickMode`;
        const quickLogin = new apiFetch(quickLoginUrl);
        await quickLogin.PUT(access_token as string, {
          openid_account: openId,
          openid_password: openIdPsw,
        });
      }
      dispatch(enableKsaService());
      dispatch(updatePageLoadingStatus(false));
    } catch (e) {
      console.error(e);
      dispatch(updatePageLoadingStatus(false));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <ToggleLeft size={30} className=" text-sky-900 dark:text-sky-100" />
        <div className="text-sky-900 dark:text-sky-100">
          <p className="font-medium">系統偵測到，您尚未啟用 KSA 服務。</p>
          <p className="text-sky-900 dark:text-sky-100">
            請滑到最下面，進行啟用。
          </p>
        </div>
      </div>
      <UserTerms />
      <form onSubmit={handleEnableKsa}>
        <div className="w-full flex items-center justify-between">
          <p>快速登入</p>
          <Switch
            checked={isOpenQuickLogin}
            onCheckedChange={setIsOpenQuickLogin}
          />
        </div>
        {isOpenQuickLogin && (
          <div className="w-full space-y-3">
            <p className="text-sm opacity-50">開啟需要您提供帳號密碼。</p>
            <Input
              placeholder="OPENID 帳號"
              className="p-3 dark:bg-sky-300/10"
              value={openId}
              onChange={(e) => setOpenId(e.target.value)}
              required
            />
            <Input
              placeholder="OPENID 密碼"
              type="password"
              className="p-3 dark:bg-sky-300/10"
              value={openIdPsw}
              onChange={(e) => setOpenIdPsw(e.target.value)}
              required
            />
          </div>
        )}
        <div className="flex items-center gap-2 mt-5">
          <Checkbox id="checkbox" required />
          <label htmlFor="checkbox">
            我同意KSA使用者條款，並繼續啟用服務。
          </label>
        </div>
        <div className="flex w-full justify-between gap-5 mt-5">
          <Link
            href="/"
            className="bg-zinc-300 dark:bg-zinc-600 rounded-xl p-2 w-full text-center font-medium hover:opacity-50 transition-all"
          >
            返回
          </Link>
          <button
            type="submit"
            className="bg-sky-600 text-white rounded-xl p-2 w-full font-medium hover:opacity-50 transition-all"
          >
            啟用
          </button>
        </div>
      </form>
    </div>
  );
}
