import { useEffect, useRef, useState } from "react";
import { Board } from "./pages/Board";
import { Gallery } from "./pages/Gallery";
import { Home } from "./pages/Home";
import { Link, NavigateProvider, pageFromPath, routes } from "./router";
import type { PageId } from "./router";
import { readTheme, writeTheme } from "./theme";
import type { Theme } from "./theme";

const titles: Record<PageId, string> = {
  home: "折角",
  gallery: "组件",
  board: "工作台",
};

export function App() {
  const [theme, setTheme] = useState<Theme>(readTheme);
  const [page, setPage] = useState<PageId | null>(() => pageFromPath(window.location.pathname));
  const skipFocus = useRef(true);

  useEffect(() => {
    function onPop() {
      setPage(pageFromPath(window.location.pathname));
    }
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    document.title = page ? titles[page] : "找不到页面";
    if (skipFocus.current) {
      skipFocus.current = false;
      return;
    }
    document.getElementById("page-title")?.focus();
  }, [page]);

  function navigate(path: string) {
    if (path === window.location.pathname) {
      setPage(pageFromPath(path));
      return;
    }
    window.history.pushState(null, "", path);
    setPage(pageFromPath(path));
  }

  function chooseTheme(next: Theme) {
    setTheme(next);
    writeTheme(next);
  }

  return (
    <NavigateProvider value={navigate}>
      <a className="skip" href="#main">
        跳到内容
      </a>
      <header className="topbar">
        <div className="wrap topbar-inner">
          <Link href="/" className="brand">
            折角
          </Link>
          <nav className="primary-nav" aria-label="页面">
            {routes.map((route) => (
              <Link
                key={route.id}
                href={route.path}
                aria-current={page === route.id ? "page" : undefined}
              >
                {route.label}
              </Link>
            ))}
          </nav>
          <div className="theme-switch" role="group" aria-label="主题">
            <button type="button" aria-pressed={theme === "light"} onClick={() => chooseTheme("light")}>
              浅色
            </button>
            <button type="button" aria-pressed={theme === "dark"} onClick={() => chooseTheme("dark")}>
              深色
            </button>
          </div>
        </div>
      </header>
      <main id="main" className="wrap page">
        {page === "home" ? <Home /> : null}
        {page === "gallery" ? <Gallery /> : null}
        {page === "board" ? <Board /> : null}
        {page === null ? <NotFound /> : null}
      </main>
      <footer className="wrap site-footer">
        <p>设计令牌、字号和禁则写在 DESIGN.md。</p>
        <p>构建时拿不准的取舍写在 DECISIONS.md。</p>
      </footer>
    </NavigateProvider>
  );
}

function NotFound() {
  return (
    <article>
      <h1 id="page-title" className="page-title" tabIndex={-1}>
        找不到这一页
      </h1>
      <p className="lede">地址不在说明、组件、工作台这三页里。</p>
      <p className="next-links prose">
        <Link href="/">回到说明</Link>
      </p>
    </article>
  );
}
