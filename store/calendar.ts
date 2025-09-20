import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Event {
  id: number;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  all_day: number;
  location: string;
  office: string;
  created_at: string;
  updated_at: string;
}

interface calendarData {
  events: Event[];
  dateWithEvents: Set<string>;
}

const initialState: calendarData = {
  events: [],
  dateWithEvents: new Set(),
};

export const calendarSlice = createSlice({
  name: "calendarData",
  initialState,
  reducers: {
    updateCalendarData: (
      state,
      action: PayloadAction<Partial<calendarData>>,
    ) => {
      Object.assign(state, action.payload);
    },
  },
});

export const { updateCalendarData } = calendarSlice.actions;
