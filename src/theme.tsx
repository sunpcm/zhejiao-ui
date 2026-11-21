import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Scheme, SchemeMode, Surface, ThemeId } from "./types";

type ThemeState = {
  theme: ThemeId;
  schemeMode: SchemeMode;
  scheme: Scheme;
  surface: Surface;
  setTheme: (theme: ThemeId) => void;
  setSchemeMode: (scheme: SchemeMode) => void;
  setSurface: (surface: Surface) => void;
};

const ThemeContext = createContext<ThemeState | null>(null);

const THEME_IDS: ThemeId[] = ["qingge", "kanci", "yingbian"];
const SURFACE_IDS: Surface[] = ["reading", "product", "infra"];
const SCHEME_MODES: SchemeMode[] = ["system", "light", "dark"];

function isTheme(value: string | null): value is ThemeId {
  return THEME_IDS.includes(value as ThemeId);
}

function isSurface(value: string | null): value is Surface {
  return SURFACE_IDS.includes(value as Surface);
}

function isSchemeMode(value: string | null): value is SchemeMode {
  return SCHEME_MODES.includes(value as SchemeMode);
}

function readStored(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function systemScheme(): Scheme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function readInitial(): {
  theme: ThemeId;
  schemeMode: SchemeMode;
  surface: Surface;
} {
  const root = document.documentElement;
  const theme = document.documentElement.getAttribute("data-theme");
  const storedMode = readStored("zhejiao-scheme");
  const mode =
    root.getAttribute("data-zj-scheme-mode") ??
    (storedMode === "light" || storedMode === "dark" ? storedMode : "system");
  const surface = document.documentElement.getAttribute("data-surface");
  return {
    theme: isTheme(theme) ? theme : "qingge",
    schemeMode: isSchemeMode(mode) ? mode : "system",
    surface: isSurface(surface) ? surface : "product",
  };
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const initial = useMemo(readInitial, []);
  const [theme, setTheme] = useState<ThemeId>(initial.theme);
  const [schemeMode, setSchemeMode] = useState<SchemeMode>(initial.schemeMode);
  const [surface, setSurface] = useState<Surface>(initial.surface);
  const [systemPreference, setSystemPreference] = useState<Scheme>(systemScheme);
  const scheme: Scheme = schemeMode === "system" ? systemPreference : schemeMode;

  useEffect(() => {
    if (schemeMode !== "system") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const sync = () => setSystemPreference(media.matches ? "dark" : "light");
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, [schemeMode]);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-zj-theme", theme);
    root.setAttribute("data-zj-scheme", scheme);
    root.setAttribute("data-zj-scheme-mode", schemeMode);
    root.setAttribute("data-theme", theme);
    root.setAttribute("data-scheme", scheme);
    root.setAttribute("data-surface", surface);
    try {
      localStorage.setItem("zhejiao-theme", theme);
      localStorage.setItem("zhejiao-scheme", schemeMode);
      localStorage.setItem("zhejiao-surface", surface);
    } catch {
      /* 忽略无法写入的本地存储。 */
    }
  }, [theme, scheme, schemeMode, surface]);

  const value = useMemo(
    () => ({ theme, schemeMode, scheme, surface, setTheme, setSchemeMode, setSurface }),
    [theme, schemeMode, scheme, surface],
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
