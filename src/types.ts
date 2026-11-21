export type ThemeId = "qingge" | "kanci" | "yingbian";

export type Scheme = "light" | "dark";

export type SchemeMode = "system" | Scheme;

export type Surface = "reading" | "product" | "infra";

export type Priority = "低" | "中" | "高" | "紧急";

export type Status = "todo" | "doing" | "review" | "done";

export type Ticket = {
  id: string;
  title: string;
  summary: string;
  place: string;
  priority: Priority;
  status: Status;
  owner: string;
  updated: string;
};

export type ToastItem = {
  id: number;
  text: string;
};
