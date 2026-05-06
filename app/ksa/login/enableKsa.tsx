import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { UserTerms } from "./terms";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { useDispatch } from "react-redux";
import { updatePageLoadingStatus } from "@/store/appSlice";
import { enableKsaService } from "@/store/userSlice";
import { ksaApi } from "@/services/api/ksa";

export function Enableksa() {
  const [isOpenQuickLogin, setIsOpenQuickLogin] = useState(false);
  const [openId, setOpenId] = useState("");
  const [openIdPsw, setOpenIdPsw] = useState("");
  const dispatch = useDispatch();

  const handleEnableKsa = async (e: FormEvent) => {
    e.preventDefault();
    try {
      dispatch(updatePageLoadingStatus(true));
      await ksaApi.enable();
      if (isOpenQuickLogin) {
        await ksaApi.linkQuickMode(openId, openIdPsw);
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
