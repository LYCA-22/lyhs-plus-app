import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AnnAttachment {
  name: string;
  url: string;
}

export interface AnnData {
  id: number;
  title: string;
  content: string;
  category: string;
  tags: string[] | null;
  is_banner: boolean;
  is_top: boolean;
  img_url: string;
  link: string;
  publisher: string;
  view_count: number;
  target_group: string | null;
  attachments: AnnAttachment[] | null;
  created_at: string;
  updated_at: string;
}

export interface schoolAnnData {
  date: string;
  department: string;
  title: string;
  link: string;
}

interface AnnouncementState {
  schoolAnnDatas: schoolAnnData[];
  lysaAnnDatas: AnnData[];
}

const initialState: AnnouncementState = {
  schoolAnnDatas: [],
  lysaAnnDatas: [],
};

export const announcementSlice = createSlice({
  name: "AnnData",
  initialState,
  reducers: {
    // 載入學校網站公告
    loadSchoolAnns: (state, action: PayloadAction<schoolAnnData[]>) => {
      state.schoolAnnDatas = action.payload;
    },
    loadLysaAnns: (state, action: PayloadAction<AnnData[]>) => {
      state.lysaAnnDatas = action.payload;
    },
  },
});

export const { loadSchoolAnns, loadLysaAnns } = announcementSlice.actions;
