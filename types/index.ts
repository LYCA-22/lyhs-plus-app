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

export type homeApps =
  | "eSchool"
  | "studyHistory"
  | "schoolWeb"
  | "mailBox"
  | "mailSearch";
