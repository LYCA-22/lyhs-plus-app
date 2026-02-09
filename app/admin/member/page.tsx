"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { API_BASE_URL, apiFetch } from "@/services/apiClass";
import { turnOnBackLink, updatePageLoadingStatus } from "@/store/appSlice";
import { useAppSelector } from "@/store/hook";
import { userMemberData } from "@/types";
import { getCookie } from "@/utils/getCookie";
import { Plus, Settings2, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export default function MemberPage() {
  const dispatch = useDispatch();
  const userData = useAppSelector((state) => state.userData);
  const [memberData, setMemberData] = useState<userMemberData[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [addMember, setAddMember] = useState(false);
  const [zhName, setZhName] = useState("");
  const [number, setNumber] = useState<number>(0);
  const [className, setClassName] = useState("");
  const [grade, setGrade] = useState("");
  const [isMember, setIsMember] = useState(false);
  const [stuId, setStuId] = useState("");
  const router = useRouter();

  useEffect(() => {
    dispatch(turnOnBackLink("/"));
    if (userData.role !== "lysaStaff") router.push("/");
  }, [router, userData, dispatch]);

  useEffect(() => {
    const FetchMemberList = async () => {
      dispatch(updatePageLoadingStatus(true));
      const memberListUrl = `${API_BASE_URL}/v1/admin/user/list`;
      const memberList = new apiFetch(memberListUrl);
      const access_token = getCookie("lyps_access_token");
      const memberListData = await memberList.GET(access_token || "");
      setMemberData(memberListData.data);
      dispatch(updatePageLoadingStatus(false));
    };

    FetchMemberList();
  }, [dispatch]);

  const handleAddMember = async (e: FormEvent) => {
    e.preventDefault();
    try {
      dispatch(updatePageLoadingStatus(true));
      const addMemberUrl = `${API_BASE_URL}/v1/admin/user/create/studentMember`;
      const addMember = new apiFetch(addMemberUrl);
      const access_token = getCookie("lyps_access_token");
      await addMember.POST(
        {
          stu_id: stuId,
          zh_name: zhName,
          class_name: className,
          grade: grade,
          number: number,
          is_member: isMember,
        },
        false,
        access_token as string,
      );

      // 載入新資料
      const memberListUrl = `${API_BASE_URL}/v1/admin/user/list`;
      const memberList = new apiFetch(memberListUrl);
      const memberListData = await memberList.GET(access_token || "");
      setMemberData(memberListData.data);

      // 將所有資料清空
      setZhName("");
      setNumber(0);
      setStuId("");
      setIsMember(false);
      setGrade("");
      setClassName("");
      setAddMember(false);
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(updatePageLoadingStatus(false));
    }
  };

  return (
    <div className="flex flex-col min-h-dvh bg-sky-50 dark:bg-background">
      <div className="p-10 px-5 pt-20">
        <h1 className="text-2xl font-medium">管理會員資料</h1>
        <p className="opacity-50">此功能僅限學生會幹部操作。</p>
      </div>
      <div className="flex items-center w-full justify-between p-5 pt-0 gap-4 text-lg font-medium">
        <button
          onClick={() => setAddMember(!addMember)}
          className={`flex items-center justify-center gap-2  rounded-xl p-2 w-full ${addMember ? "bg-sky-900 dark:bg-sky-200 text-white dark:text-sky-900" : "dark:bg-sky-900 bg-sky-200"} transition-all`}
        >
          {addMember ? (
            <>
              <X></X>關閉新增
            </>
          ) : (
            <>
              <Plus />
              新增學生會員
            </>
          )}
        </button>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`flex items-center justify-center gap-2  rounded-xl p-2 w-full ${isEditing ? "bg-sky-900 dark:bg-sky-200 text-white dark:text-sky-900" : "dark:bg-sky-900 bg-sky-200"} transition-all`}
        >
          {isEditing ? (
            <>
              <X></X>關閉編輯
            </>
          ) : (
            <>
              <Settings2 />
              編輯會員
            </>
          )}
        </button>
      </div>
      {addMember && (
        <div className="bg-background dark:bg-sky-300/10 rounded-xl p-5 m-4 mt-0">
          <p className="text-xl font-medium">新增新學生會員</p>
          <form className="space-y-3" onSubmit={handleAddMember}>
            <div className="flex items-center gap-4 justify-between">
              <div className="space-y-3 mt-2">
                <label htmlFor="stu_id">學號</label>
                <Input
                  placeholder="stu_id"
                  id="stu_id"
                  type="text"
                  className={`dark:bg-sky-300/10 p-4 py-3 text-[14px]`}
                  required
                  value={stuId}
                  onChange={(e) => setStuId(e.target.value)}
                />
              </div>
              <div className="space-y-3 mt-2">
                <label htmlFor="zh_name">中文姓名</label>
                <Input
                  placeholder="zh_name"
                  id="zh_name"
                  type="text"
                  className={`dark:bg-sky-300/10 p-4 py-3 text-[14px]`}
                  required
                  value={zhName}
                  onChange={(e) => setZhName(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center gap-4 justify-between">
              <div className="space-y-3 mt-2 w-full">
                <label htmlFor="grade">年級</label>
                <Select value={grade} onValueChange={setGrade}>
                  <SelectTrigger className="w-full shadow-none rounded-xl bg-hoverbg border-0 dark:bg-sky-300/10">
                    <SelectValue placeholder="Grade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="高一">高一</SelectItem>
                    <SelectItem value="高二">高二</SelectItem>
                    <SelectItem value="高三">高三</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3 mt-2 w-full">
                <label htmlFor="class">班級</label>
                <Select value={className} onValueChange={setClassName}>
                  <SelectTrigger className="w-full shadow-none rounded-xl bg-hoverbg border-0 dark:bg-sky-300/10">
                    <SelectValue placeholder="Class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="忠">忠</SelectItem>
                    <SelectItem value="孝">孝</SelectItem>
                    <SelectItem value="仁">仁</SelectItem>
                    <SelectItem value="愛">愛</SelectItem>
                    <SelectItem value="信">信</SelectItem>
                    <SelectItem value="義">義</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3 mt-2 w-full">
                <label htmlFor="number">座號</label>
                <Input
                  placeholder="number"
                  id="number"
                  type="number"
                  className={`dark:bg-sky-300/10 p-4 py-3 text-[14px]`}
                  required
                  value={number}
                  onChange={(e) => setNumber(parseInt(e.target.value))}
                />
              </div>
            </div>
            <div className="space-y-3 flex items-center gap-3 font-medium">
              <Checkbox
                id="memberShip"
                className="mt-3"
                checked={isMember}
                onCheckedChange={() => setIsMember(!isMember)}
              />
              <label htmlFor="memberShip">繳會費</label>
            </div>
            <div className="flex w-full justify-between gap-5">
              <button
                onClick={() => setAddMember(false)}
                className="bg-zinc-300 dark:bg-zinc-600 rounded-xl p-2 w-full text-center font-medium hover:opacity-50 transition-all"
              >
                取消
              </button>
              <button
                type="submit"
                className="bg-sky-600 text-white rounded-xl p-2 w-full font-medium hover:opacity-50 transition-all"
              >
                送出
              </button>
            </div>
          </form>
        </div>
      )}
      <div className="grow bg-background dark:bg-blue-300/10 rounded-t-3xl p-5 pb-40 px-8">
        <p className="text-xl font-medium mb-2">現有會員列表</p>
        {memberData.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div>
                <h2 className="text-lg font-medium">{item.zh_name}</h2>
                <p className="opacity-50">
                  {item.stu_id}, {item.is_member ? "有" : "沒有"}繳會費,{" "}
                  {item.ksa_enabled ? "已啟用" : "未啟用"}KSA服務
                </p>
              </div>
            </div>
            {isEditing && (
              <div className="flex items-center gap-4">
                <button className="flex items-center justify-center gap-2 rounded-xl p-2 bg-red-200 dark:bg-red-900 text-red-600 hover:opacity-50 transition-all">
                  <Trash2 />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
