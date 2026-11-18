import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Scheme, ThemeId } from "./types";

type ThemeState = {
  theme: ThemeId;
  scheme: Scheme;
  setTheme: (theme: ThemeId) => void;
  setScheme: (scheme: Scheme) => void;
};

const ThemeContext = createContext<ThemeState | null>(null);

function readInitial(): { theme: ThemeId; scheme: Scheme } {
  const theme = document.documentElement.getAttribute("data-theme");
  const scheme = document.documentElement.getAttribute("data-scheme");
  return {
    theme: theme === "kanci" || theme === "yingbian" || theme === "qingge" ? theme : "qingge",
    scheme: scheme === "dark" ? "dark" : "light",
  };
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeId>(() => readInitial().theme);
  const [scheme, setScheme] = useState<Scheme>(() => readInitial().scheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.setAttribute("data-scheme", scheme);
    try {
      localStorage.setItem("zhejiao-theme", theme);
      localStorage.setItem("zhejiao-scheme", scheme);
    } catch {
      /* 忽略无法写入的本地存储。 */
    }
  }, [theme, scheme]);

  const value = useMemo(
    () => ({ theme, scheme, setTheme, setScheme }),
    [theme, scheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) {
    throw new Error("useTheme 必须用在 ThemeProvider 里");
  }
  return value;
}
