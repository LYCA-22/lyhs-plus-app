import { apiService } from "@/services/api";
import { Event, updateCalendarData } from "@/store/calendar";
import { store } from "@/store/store";
import { format, parseISO, eachDayOfInterval } from "date-fns";

export async function UpdateCalendar() {
  const UpdateData = (dates: Set<string>, calendarData: Event[]) => {
    store.dispatch(
      updateCalendarData({ events: calendarData, dateWithEvents: dates }),
    );
  };

  const calendarData: Event[] = await apiService.getAllEvents();
  if (calendarData) {
    const dates = new Set<string>();
    calendarData.forEach((event: Event) => {
      const eventStartDate = parseISO(event.start_time);
      const eventEndDate = parseISO(event.end_time);

      // 為事件範圍內的每一天添加日期標記
      const eventDays = eachDayOfInterval({
        start: eventStartDate,
        end: eventEndDate,
      });

      eventDays.forEach((day) => {
        dates.add(format(day, "yyyy-MM-dd"));
      });
    });
    UpdateData(dates, calendarData);
  }
}
