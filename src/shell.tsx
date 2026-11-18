import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { SURFACES, THEMES } from "./data";
import { useStore } from "./store";
import { useTheme } from "./theme";
import type { Scheme, Surface, ThemeId } from "./types";

const SCHEMES: { id: Scheme; name: string }[] = [
  { id: "light", name: "浅色" },
  { id: "dark", name: "深色" },
];

const SURFACE_PATHS = new Set(SURFACES.map((item) => item.path));

export function Shell() {
  const { theme, scheme, surface, setTheme, setScheme, setSurface } = useTheme();
  const { toasts, pushToast } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
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

  function chooseSurface(id: Surface, name: string, path: string) {
    if (id === surface) {
      if (SURFACE_PATHS.has(location.pathname) && location.pathname !== path) navigate(path);
      return;
    }
    setSurface(id);
    pushToast(`版面已换成${name}。主题没变。`);
    if (SURFACE_PATHS.has(location.pathname) || location.pathname === "/board") navigate(path);
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
            {SURFACES.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) => (isActive ? "nav-link is-active" : "nav-link")}
              >
                {item.name}
              </NavLink>
            ))}
            <NavLink
              to="/gallery"
              className={({ isActive }) => (isActive ? "nav-link is-active" : "nav-link")}
            >
              组件
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
            <div className="seg" role="group" aria-label="版面">
              {SURFACES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="seg-btn"
                  aria-pressed={surface === item.id}
                  onClick={() => chooseSurface(item.id, item.name, item.path)}
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
