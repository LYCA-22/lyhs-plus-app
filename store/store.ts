import { configureStore } from "@reduxjs/toolkit";
import { userSlice } from "./userSlice";
import { systemSlice } from "./systemSlice";

export const store = configureStore({
  reducer: {
    userData: userSlice.reducer,
    systemStatus: systemSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
