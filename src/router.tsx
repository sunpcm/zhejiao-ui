import { createContext, useContext } from "react";
import type { MouseEvent, ReactNode } from "react";

export type PageId = "home" | "gallery" | "board";

export const routes: { id: PageId; path: string; label: string }[] = [
  { id: "home", path: "/", label: "说明" },
  { id: "gallery", path: "/gallery", label: "组件" },
  { id: "board", path: "/board", label: "工作台" },
];

export function pageFromPath(pathname: string): PageId | null {
  const path = pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;
  const found = routes.find((route) => route.path === path);
  return found ? found.id : null;
}

const NavigateContext = createContext<(path: string) => void>(() => {});

export const NavigateProvider = NavigateContext.Provider;

export function useNavigate(): (path: string) => void {
  return useContext(NavigateContext);
}

type LinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  "aria-current"?: "page";
};

export function Link({ href, children, className, ...rest }: LinkProps) {
  const navigate = useNavigate();

  function onClick(event: MouseEvent<HTMLAnchorElement>) {
    if (event.defaultPrevented) return;
    if (event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    navigate(href);
  }

  return (
    <a href={href} className={className} onClick={onClick} {...rest}>
      {children}
    </a>
  );
}
