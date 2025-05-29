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

export interface Announcement {
  date: string;
  department: string;
  title: string;
  link: string;
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
