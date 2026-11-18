import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { TICKETS } from "./data";
import type { Priority, Status, Ticket, ToastItem } from "./types";

type NewTicket = {
  title: string;
  summary: string;
  place: string;
  priority: Priority;
};

type Store = {
  tickets: Ticket[];
  selectedId: string | null;
  query: string;
  priority: Priority | "全部";
  toasts: ToastItem[];
  filtered: Ticket[];
  select: (id: string) => void;
  setQuery: (query: string) => void;
  setPriority: (priority: Priority | "全部") => void;
  clearFilters: () => void;
  setStatus: (id: string, status: Status) => boolean;
  addTicket: (input: NewTicket) => Ticket;
  pushToast: (text: string) => void;
};

const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [tickets, setTickets] = useState<Ticket[]>(TICKETS);
  const [selectedId, setSelectedId] = useState<string | null>("GD-1079");
  const [query, setQuery] = useState("");
  const [priority, setPriority] = useState<Priority | "全部">("全部");
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const seq = useRef(1089);
  const toastSeq = useRef(1);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const bucket = timers.current;
    return () => {
      bucket.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  const pushToast = useCallback((text: string) => {
    const id = toastSeq.current++;
    setToasts((list) => [...list, { id, text }].slice(-3));
    const timer = window.setTimeout(() => {
      setToasts((list) => list.filter((item) => item.id !== id));
    }, 3800);
    timers.current.push(timer);
  }, []);

  const select = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  const clearFilters = useCallback(() => {
    setQuery("");
    setPriority("全部");
  }, []);

  const setStatus = useCallback((id: string, status: Status) => {
    const current = tickets.find((item) => item.id === id);
    if (!current || current.status === status) return false;
    setTickets((list) =>
      list.map((item) => (item.id === id ? { ...item, status, updated: "刚刚" } : item)),
    );
    return true;
  }, [tickets]);

  const addTicket = useCallback((input: NewTicket) => {
    const ticket: Ticket = {
      id: `GD-${seq.current++}`,
      title: input.title,
      summary: input.summary,
      place: input.place,
      priority: input.priority,
      status: "todo",
      owner: "未分派",
      updated: "刚刚",
    };
    setTickets((list) => [ticket, ...list]);
    setSelectedId(ticket.id);
    return ticket;
  }, []);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return tickets.filter((ticket) => {
      const matchesPriority = priority === "全部" || ticket.priority === priority;
      if (!matchesPriority) return false;
      if (!needle) return true;
      const haystack = [ticket.id, ticket.title, ticket.summary, ticket.place, ticket.owner]
        .join(" ")
        .toLowerCase();
      return haystack.includes(needle);
    });
  }, [tickets, query, priority]);

  const value = useMemo(
    () => ({
      tickets,
      selectedId,
      query,
      priority,
      toasts,
      filtered,
      select,
      setQuery,
      setPriority,
      clearFilters,
      setStatus,
      addTicket,
      pushToast,
    }),
    [
      tickets,
      selectedId,
      query,
      priority,
      toasts,
      filtered,
      select,
      clearFilters,
      setStatus,
      addTicket,
      pushToast,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const value = useContext(StoreContext);
  if (!value) {
    throw new Error("useStore 必须用在 StoreProvider 里");
  }
  return value;
}
