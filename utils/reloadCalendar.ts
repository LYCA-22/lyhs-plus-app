import { apiService } from "@/services/api";
import { Event, updateCalendarData } from "@/store/calendar";
import { store } from "@/store/store";
import { format, parseISO } from "date-fns";

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
      const eventDate = format(parseISO(event.start_time), "yyyy-MM-dd");
      dates.add(eventDate);
    });
    UpdateData(dates, calendarData);
  }
}
