import { configureStore } from "@reduxjs/toolkit";
import { userSlice } from "./userSlice";
import { systemSlice } from "./systemSlice";
import { calendarSlice } from "./calendar";
import { announcementSlice } from "./newsSlice";

export const store = configureStore({
  reducer: {
    userData: userSlice.reducer,
    systemData: systemSlice.reducer,
    newsData: announcementSlice.reducer,
    calendarData: calendarSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      // 如果你需要的話，可以添加更多中間件配置
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
