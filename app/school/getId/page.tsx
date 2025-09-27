"use client";

import { useAppDispatch } from "@/store/hook";
import { updateSystemData } from "@/store/systemSlice";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiService } from "@/services/api";

interface data {
  sn: string;
  now_seat: string;
  openid: string;
}

export default function Page() {
  const dispatch = useAppDispatch();
  const [grade, setGrade] = useState("3");
  const [classId, setClassId] = useState("0");
  const [data, setData] = useState<data[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (grade && classId) {
      const getOpenId = async () => {
        const data = await apiService.getClassOpenId(classId, grade);
        setData(data);
      };
      getOpenId();
    }
  }, [grade, classId]);

  useEffect(() => {
    dispatch(
      updateSystemData({
        isBack: true,
        BackLink: "/school/login/openId",
      }),
    );
  });

  const copyToClipboard = async (openId: string) => {
    try {
      await navigator.clipboard.writeText(openId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("複製失敗:", err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center relative w-full">
      <div
        className={`z-50 fixed bg-hoverbg border border-borderColor font-medium rounded-full shadow-lg p-2 px-4 transition-all ${copied ? "top-14 opacity-100" : "opacity-0 top-0"}`}
      >
        複製成功
      </div>
      <div className="flex items-center justify-center gap-2 p-4">
        <p>年級</p>
        <Select defaultValue="3" onValueChange={setGrade} value={grade}>
          <SelectTrigger className="w-[120px] rounded-full border-0 bg-hoverbg shadow-none">
            <SelectValue placeholder="年級" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3">高一</SelectItem>
            <SelectItem value="4">高二</SelectItem>
            <SelectItem value="5">高三</SelectItem>
          </SelectContent>
        </Select>
        <p>班級</p>
        <Select defaultValue="0" value={classId} onValueChange={setClassId}>
          <SelectTrigger className="w-[120px] rounded-full border-0 bg-hoverbg shadow-none">
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
      </div>
      {data && (
        <div className="w-full px-5 mb-28">
          <ul className="w-full relative space-y-2 rounded-3xl border border-border p-4">
            <li className="border-b border-border flex items-center pb-2 w-full justify-between last:border-0">
              <p>座號</p>
              <p>帳號</p>
            </li>
            {data.map((item, index) => (
              <li
                key={index}
                className="border-b border-border pb-2 flex items-center w-full justify-between last:border-0"
              >
                <p>{item.now_seat}</p>
                <div className="flex items-center gap-2">
                  <p>{item.openid}</p>
                  <button
                    className="bg-hoverbg text-sm rounded-full p-2 px-3 font-medium"
                    onClick={() => {
                      copyToClipboard(item.openid);
                    }}
                  >
                    複製
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
