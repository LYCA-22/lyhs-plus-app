// 首頁行事曆組件
import { useAppSelector } from "@/store/hook";
import { parseISO, isSameDay, isWithinInterval } from "date-fns";
import Link from "next/link";

export default function Calendar() {
  const calendarData = useAppSelector((state) => state.calendarData);

  return (
    <div className="bg-inputPrimary text-white rounded-3xl p-4 m-2 flex flex-col gap-2">
      <h3 className="opacity-50">今天的活動</h3>

      <div>
        {(() => {
          const today = new Date();

          const todayEvents = calendarData.events.filter((event) => {
            const eventStartDate = parseISO(event.start_time);
            const eventEndDate = parseISO(event.end_time);

            // 檢查今天是否在事件時間範圍內
            return (
              isSameDay(eventStartDate, today) ||
              isSameDay(eventEndDate, today) ||
              isWithinInterval(today, {
                start: eventStartDate,
                end: eventEndDate,
              })
            );
          });

          return todayEvents.length > 0 ? (
            todayEvents.slice(0, 2).map((event, index) => (
              <div key={index} className="flex items-center gap-2 mb-1">
                <div className="h-4 bg-background w-4 rounded-full border-2 border-sky-300"></div>
                <p className="font-medium">{event.title}</p>
              </div>
            ))
          ) : (
            <div className="w-full overflow-hidden rounded-lg p-2">
              <p className="text-sm truncate">今天沒有活動</p>
            </div>
          );
        })()}
      </div>
      <div className="flex mt-auto">
        <Link
          href={"/calendar"}
          className="bg-foreground text-background bg-opacity-70 p-2 px-3 rounded-full"
        >
          查看更多
        </Link>
      </div>
    </div>
  );
}
