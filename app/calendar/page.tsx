"use client";
import { useEffect, useState } from "react";
import { apiService } from "@/services/api";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { zhTW } from "date-fns/locale";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  office: string;
}

export default function Page() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const [dateWithEvents, setDateWithEvents] = useState<Set<string>>(new Set());

  useEffect(() => {
    const getEvents = async () => {
      const data = await apiService.getAllEvents();
      setEvents(data);

      // 建立有事件的日期集合
      const dates = new Set<string>();
      data.forEach((event: Event) => {
        dates.add(event.date);
      });
      setDateWithEvents(dates);
    };
    getEvents();
  }, []);

  // 取得選擇日期的事件
  const selectedEvents = events.filter(
    (event) =>
      event.date === (selectedDate ? format(selectedDate, "yyyy-MM-dd") : ""),
  );

  // 辦公室名稱對應的標籤顏色
  const officeColors: Record<string, string> = {
    stu: "bg-blue-500",
    admin: "bg-green-500",
    teacher: "bg-purple-500",
  };

  return (
    <div className="container mx-auto p-4 pt-6">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col justify-center items-center">
          <div className="flex flex-col gap-1 px-2 text-center">
            <p className="text-sm opacity-50">選擇日期查看事件</p>
          </div>
          <div className="flex relative w-full">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              locale={zhTW}
              className="border rounded-[20px] m-2 mt-4 bg-rootBg w-full"
              modifiers={{
                hasEvent: (date) =>
                  dateWithEvents.has(format(date, "yyyy-MM-dd")),
              }}
            />
          </div>
        </div>
        <Card className="shadow-none p-0 rounded-none border-0 bg-transparent">
          <CardHeader className="py-1 pb-4 px-2">
            <CardTitle>
              {selectedDate
                ? format(selectedDate, "yyyy年MM月dd日", { locale: zhTW })
                : "未選擇日期"}{" "}
              的事件
            </CardTitle>
            <CardDescription>
              共有 {selectedEvents.length} 個事件
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            {selectedEvents.length === 0 ? (
              <p className="text-muted-foreground">這天沒有排定事件</p>
            ) : (
              <div className="space-y-4">
                {selectedEvents.map((event) => (
                  <Card
                    key={event.id}
                    className="overflow-hidden dark:bg-zinc-700/50 shadow-none rounded-2xl bg-hoverbg"
                  >
                    <div className="flex items-center p-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold">{event.title}</h3>
                          <Badge
                            className={
                              officeColors[event.office] || "bg-gray-500"
                            }
                          >
                            {event.office}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {event.description !== "無"
                            ? event.description
                            : "無描述"}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
