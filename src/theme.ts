export type Theme = "light" | "dark";

export const THEME_KEY = "zhejiao-theme";

export function readTheme(): Theme {
  const value = document.documentElement.dataset.theme;
  return value === "dark" ? "dark" : "light";
}

export function writeTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    /* 无存储时只改当前页 */
  }
}
