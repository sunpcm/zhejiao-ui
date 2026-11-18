import { NavLink, Outlet } from "react-router-dom";
import { THEMES } from "./data";
import { useStore } from "./store";
import { useTheme } from "./theme";
import type { Scheme, ThemeId } from "./types";

const SCHEMES: { id: Scheme; name: string }[] = [
  { id: "light", name: "浅色" },
  { id: "dark", name: "深色" },
];

export function Shell() {
  const { theme, scheme, setTheme, setScheme } = useTheme();
  const { toasts, pushToast } = useStore();
  const schemeName = scheme === "dark" ? "深色" : "浅色";

  function chooseTheme(id: ThemeId, name: string) {
    if (id === theme) return;
    setTheme(id);
    pushToast(`已换成${name}，${schemeName}。`);
  }

  function chooseScheme(id: Scheme, name: string) {
    if (id === scheme) return;
    setScheme(id);
    const themeName = THEMES.find((item) => item.id === theme)?.name ?? "青格";
    pushToast(`已换成${themeName}，${name}。`);
  }

  return (
    <div className="app">
      <a className="skip" href="#main">
        跳到正文
      </a>
      <header className="mast">
        <div className="wrap mast-inner">
          <div className="brand">
            <NavLink to="/" end className="logo-link">
              <span className="logo">工单台</span>
            </NavLink>
            <p className="brand-note">内部工单与台账</p>
          </div>
          <nav className="nav" aria-label="页面">
            <NavLink to="/" end className={({ isActive }) => (isActive ? "nav-link is-active" : "nav-link")}>
              说明
            </NavLink>
            <NavLink
              to="/gallery"
              className={({ isActive }) => (isActive ? "nav-link is-active" : "nav-link")}
            >
              组件
            </NavLink>
            <NavLink
              to="/board"
              className={({ isActive }) => (isActive ? "nav-link is-active" : "nav-link")}
            >
              工作台
            </NavLink>
          </nav>
          <div className="controls">
            <div className="seg" role="group" aria-label="主题">
              {THEMES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="seg-btn"
                  aria-pressed={theme === item.id}
                  onClick={() => chooseTheme(item.id, item.name)}
                >
                  {item.name}
                </button>
              ))}
            </div>
            <div className="seg" role="group" aria-label="明暗">
              {SCHEMES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="seg-btn"
                  aria-pressed={scheme === item.id}
                  onClick={() => chooseScheme(item.id, item.name)}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>
      <main id="main" className="wrap page" tabIndex={-1}>
        <Outlet />
      </main>
      <div className="toasts" aria-live="polite" aria-relevant="additions">
        {toasts.map((item) => (
          <p key={item.id} className="toast" role="status">
            {item.text}
          </p>
        ))}
      </div>
    </div>
  );
}
