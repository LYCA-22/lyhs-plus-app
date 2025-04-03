"use client";
import { useEffect, useState } from "react";
import { apiService } from "@/services/api";
import { format, startOfWeek, addDays, isSameDay } from "date-fns";
import { zhTW } from "date-fns/locale";
import { CalendarX, ChevronLeft, ChevronRight } from "lucide-react";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  office: string;
}

export default function Page() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dateWithEvents, setDateWithEvents] = useState<Set<string>>(new Set());
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(
    startOfWeek(new Date(), { weekStartsOn: 0 }), // 从周日开始
  );

  useEffect(() => {
    const getEvents = async () => {
      const data = await apiService.getAllEvents();
      setEvents(data);
      const dates = new Set<string>();
      data.forEach((event: Event) => {
        dates.add(event.date);
      });
      setDateWithEvents(dates);
    };
    getEvents();
  }, []);

  const weekDays = Array(7)
    .fill(null)
    .map((_, i) => addDays(currentWeekStart, i));

  const selectedEvents = events.filter(
    (event) => event.date === format(selectedDate, "yyyy-MM-dd"),
  );

  const officeColors: Record<string, string> = {
    stu: "bg-blue-500",
    lib: "bg-green-500",
    coun: "bg-purple-500",
    edu: "bg-sky-300",
    lyca: "bg-red-300",
  };

  const officeZhName: Record<string, string> = {
    lyca: "班聯會",
    stu: "學務處",
    lib: "圖書館",
    coun: "輔導處",
    edu: "教務處",
  };

  const hasEvent = (date: Date) => {
    return dateWithEvents.has(format(date, "yyyy-MM-dd"));
  };

  const prevWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, -7));
  };

  const nextWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, 7));
  };

  const currentWeek = () => {
    setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 0 })); // 从周日开始
    setSelectedDate(new Date());
  };

  return (
    <div className="container mx-auto px-3">
      <div className="flex flex-col">
        <div className="flex flex-col justify-center items-center">
          <div className="w-full mx-2 mt-6 px-4">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <button
                  onClick={prevWeek}
                  className="p-2 bg-buttonBg rounded-2xl"
                >
                  <ChevronLeft
                    size={20}
                    strokeWidth={2.5}
                    className="opacity-50"
                  />
                </button>
                <button
                  onClick={currentWeek}
                  className="p-2 px-4 bg-inputPrimary text-white rounded-2xl"
                >
                  本週
                </button>
                <button
                  onClick={nextWeek}
                  className="p-2 bg-buttonBg rounded-2xl"
                >
                  <ChevronRight
                    size={20}
                    strokeWidth={2.5}
                    className="opacity-50"
                  />
                </button>
              </div>
              <div className="text-2xl text-right">
                <p className="text-lg">
                  {format(selectedDate, "yyyy年", { locale: zhTW })}
                </p>
                <p>{format(selectedDate, "MM月dd日", { locale: zhTW })}</p>
              </div>
            </div>
            <div className="flex justify-between gap-2">
              {weekDays.map((date, i) => {
                const isSelected = isSameDay(date, selectedDate);
                const dateHasEvent = hasEvent(date);

                return (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <div
                      className={`h-[6px] w-[6px] rounded-full z-50 ${dateHasEvent ? "bg-red-600" : "bg-transparent"}`}
                    ></div>
                    <button
                      className={`h-10 w-10  rounded-2xl flex items-center justify-center relative
                      ${isSelected ? "bg-primary text-primary-foreground" : "hover:bg-hoverbg"}`}
                      onClick={() => setSelectedDate(date)}
                    >
                      {format(date, "d")}
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between gap-2 text-center mt-2 opacity-50">
              {["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"].map(
                (day, index) => (
                  <div key={index} className="font-medium text-sm h-10 w-10">
                    {day}
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
        <div className="w-full bg-border h-[2px] rounded-full dark:bg-zinc-700 opacity-50 mb-1"></div>
        <div className="px-2 mb-28">
          {selectedEvents.length === 0 ? (
            <div className="w-full flex items-center flex-col gap-2 justify-center p-4 py-8">
              <CalendarX size={30} strokeWidth={2} className="opacity-50" />
              <p className="text-muted-foreground text-lg">沒有任何事件</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {selectedEvents.map((event) => (
                <div key={event.id}>
                  <div className="flex items-center p-4 pt-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold">{event.title}</h3>
                        <div
                          className={`rounded-xl px-2 p-1 text-sm text-white ${officeColors[event.office]}`}
                        >
                          {officeZhName[event.office]}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {event.description !== "無"
                          ? event.description
                          : "無描述"}
                      </p>
                    </div>
                  </div>
                  <div className="w-full bg-border h-[2px] rounded-full dark:bg-zinc-700 opacity-50 mb-1"></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
