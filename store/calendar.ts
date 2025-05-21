import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  office: string;
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
