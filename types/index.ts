export interface userMemberData {
  uuid: string;
  display_name: string;
  zh_name: string;
  role: "studentMember" | "lysaStaff" | "lyhsTeacher";
  is_disabled: boolean;
  class_name: "忠" | "仁" | "孝" | "愛" | "信" | "義";
  grade: "高一" | "高二" | "高三";
  number: number;
  stu_id: string;
  is_member: boolean;
  ksa_enabled: boolean;
  openid_account: string | null;
  openid_password: string | null;
  created_at: string;
  updated_at: string;
}

// 舊版，待刪除
export interface userData {
  email: string;
  password: string;
  name: string;
  type?: "staff" | "normal";
  level?: string;
  Class: string;
  grade: string;
  role?: string;
}

export interface QuizData {
  question: string;
  answer: string;
  explanation: string;
}

// mailbox
export interface studentData {
  id: string;
  searchCode: string;
  email: string;
  name: string;
  type: string;
  title: string;
  description: string;
  class: string;
  number: string;
  solution: string;
  handler: string;
  status: string;
  createdTime: string;
  updatedTime: string;
}

export enum homeApps {
  eSchool = "eSchool",
  studyHistory = "studyHistory",
  schoolWeb = "schoolWeb",
  mailBox = "mailBox",
  mailSearch = "mailSearch",
  calendar = "calendar",
  repair = "repair",
}

export interface App {
  name: string;
  icon: string;
  onclick?: string;
  link?: string;
  type: "btn" | "link";
  color: string;
  description: string;
}

export interface schemaItem {
  title: string;
  title2?: string;
  description?: string;
  type: "link" | "btn" | "component";
  isOutLink?: boolean;
  href?: string;
  href2?: string;
  access_manage: boolean;
  userCheck?: boolean;
  component?: React.ReactNode;
  icon?: React.ReactNode;
  btnfunction?: string;
  itemIcon: React.ReactNode;
}

export interface ClassList {
  sco4: null;
  clsId: number;
  sco3: null;
  sco6: number;
  hourTot: number;
  sco5: null;
  sco2: null;
  sco1: number;
  stdCname: string;
  stdNo: string;
  hourSum: number;
  credSum: number;
  stdId: number;
  retainM: null;
  id: number;
  seme: number;
  upgrade: string;
  credTot: number;
  subjTot: number;
  subjSum: number;
  credMust: number;
  seat: string;
  stdSemeId: number;
  clsCname: string;
  grade: number;
  syear: number;
  stdSeme1Id: number;
}

// Sentry Error
export class SentryExampleFrontendError extends Error {
  constructor(message: string | undefined) {
    super(message);
    this.name = "SentryExampleFrontendError";
  }
}

export enum Class {
  C1 = "忠",
  C2 = "孝",
  C3 = "仁",
  C4 = "愛",
  C5 = "信",
  C6 = "義",
}

export enum Grade {
  G1 = "高一",
  G2 = "高二",
  G3 = "高三",
}
