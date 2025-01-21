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
