import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Announcement } from "@/types";

interface AnnouncementState {
  announcements: Announcement[];
  isLoading: boolean;
  error: string | null;
}

const initialState: AnnouncementState = {
  announcements: [],
  isLoading: true,
  error: null,
};
export const announcementSlice = createSlice({
  name: "announcements",
  initialState,
  reducers: {
    loadNews: (state, action: PayloadAction<Announcement[]>) => {
      state.announcements = action.payload;
      state.isLoading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setLoading, setError, loadNews } = announcementSlice.actions;
