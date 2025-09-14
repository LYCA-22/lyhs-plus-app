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
  const [grade, setGrade] = useState("");
  const [classId, setClassId] = useState("");
  const [data, setData] = useState<data[]>([]);

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

  return (
    <div className="flex flex-col items-center justify-center relative w-full">
      <h1>此頁面提供您查詢您的OPENID</h1>
      <div className="flex items-center justify-center gap-2 p-4">
        <Select defaultValue="3" onValueChange={setGrade} value={grade}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="年級" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3">高一</SelectItem>
            <SelectItem value="4">高二</SelectItem>
            <SelectItem value="5">高三</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="0" value={classId} onValueChange={setClassId}>
          <SelectTrigger className="w-[130px]">
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
        <div className="w-full px-10 mb-28">
          <ul className="w-full relative space-y-2">
            <li className="border-b border-border flex items-center w-full justify-between last:border-0">
              <p>座號</p>
              <p>帳號</p>
            </li>
            {data.map((item, index) => (
              <li
                key={index}
                className="border-b border-border flex items-center w-full justify-between last:border-0"
              >
                <p>{item.now_seat}</p>
                <p>{item.openid}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
