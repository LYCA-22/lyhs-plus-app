import { apiService } from "@/services/api";
import { Event, updateCalendarData } from "@/store/calendar";
import { store } from "@/store/store";

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
      dates.add(event.date);
    });
    UpdateData(dates, calendarData);
  }
}
