import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Scheme, Surface, ThemeId } from "./types";

type ThemeState = {
  theme: ThemeId;
  scheme: Scheme;
  surface: Surface;
  setTheme: (theme: ThemeId) => void;
  setScheme: (scheme: Scheme) => void;
  setSurface: (surface: Surface) => void;
};

const ThemeContext = createContext<ThemeState | null>(null);

function readInitial(): { theme: ThemeId; scheme: Scheme; surface: Surface } {
  const theme = document.documentElement.getAttribute("data-theme");
  const scheme = document.documentElement.getAttribute("data-scheme");
  const surface = document.documentElement.getAttribute("data-surface");
  return {
    theme: theme === "kanci" || theme === "yingbian" || theme === "qingge" ? theme : "qingge",
    scheme: scheme === "dark" ? "dark" : "light",
    surface: surface === "reading" || surface === "infra" || surface === "product" ? surface : "product",
  };
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeId>(() => readInitial().theme);
  const [scheme, setScheme] = useState<Scheme>(() => readInitial().scheme);
  const [surface, setSurface] = useState<Surface>(() => readInitial().surface);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.setAttribute("data-scheme", scheme);
    document.documentElement.setAttribute("data-surface", surface);
    try {
      localStorage.setItem("zhejiao-theme", theme);
      localStorage.setItem("zhejiao-scheme", scheme);
      localStorage.setItem("zhejiao-surface", surface);
    } catch {
      /* 忽略无法写入的本地存储。 */
    }
  }, [theme, scheme, surface]);

  const value = useMemo(
    () => ({ theme, scheme, surface, setTheme, setScheme, setSurface }),
    [theme, scheme, surface],
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
