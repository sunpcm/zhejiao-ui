import { useEffect } from "react";
import { Link } from "react-router-dom";
import { THEMES } from "../data";
import { useStore } from "../store";
import { useTheme } from "../theme";
import type { ThemeId } from "../types";

export function HomePage() {
  const { theme, scheme, setTheme } = useTheme();
  const { pushToast } = useStore();
  const current = THEMES.find((item) => item.id === theme) ?? THEMES[0];
  const schemeName = scheme === "dark" ? "深色" : "浅色";

  useEffect(() => {
    document.title = "说明 · 工单台";
  }, []);

  function applyTheme(id: ThemeId, name: string) {
    if (id === theme) return;
    setTheme(id);
    pushToast(`已换成${name}，${schemeName}。样张本身保持浅色，整页已经换过去。`);
  }

  return (
    <>
      <div className="home-top">
        <div className="home-copy">
          <h1>同一套工单台，三套看法</h1>
          <p className="lede">
            <span className="drop">这</span>
            <span className="lede-body">套页面是内部工单台，用来登记、分派和改状态。三套主题共用同一批工单和同一组操作，只换已经锁死的视觉。样张可以切换整站，选择会留在这台浏览器里。控件走查在<Link to="/gallery">组件</Link>，改状态在<Link to="/board">工作台</Link>。</span>
          </p>
          <p className="now">
            当前是{current.name}，{schemeName}。
          </p>
        </div>
        <blockquote className="pull">
          <p>同一条工单，在三套界面里都要一样好找、一样好改。</p>
        </blockquote>
      </div>

      <section className="block" aria-labelledby="spec-heading">
        <h2 id="spec-heading">样张</h2>
        <p className="section-note">三块都固定为各自的浅色，方便对照。整页的深色用页眉右侧切换。</p>
        <div className="specimen-row">
          {THEMES.map((item) => (
            <article
              key={item.id}
              className={`specimen specimen-${item.id}`}
              data-current={theme === item.id ? "true" : "false"}
            >
              <p className="spec-index">{item.index}</p>
              <h3>{item.name}</h3>
              <p className="spec-words">{item.words}</p>
              <div className="spec-sheet">
                <p className="spec-id">GD-1079</p>
                <p className="spec-title">监控时间不同步</p>
                <p className="spec-copy">地库摄像头快了六分钟，回放对不上门禁。</p>
                <p className="spec-tag">紧急</p>
              </div>
              <button
                type="button"
                className="spec-btn"
                aria-pressed={theme === item.id}
                onClick={() => applyTheme(item.id, item.name)}
              >
                {theme === item.id ? "当前主题" : `换成${item.name}`}
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="block" aria-labelledby="trait-heading">
        <h2 id="trait-heading">各自锁死</h2>
        <ol className="traits">
          <li>
            <span className="trait-name">青格</span>
            <span>克制、清晰、网格、当代。分层靠短阴影和明度差，青绿只点在链接、主按钮和焦点上。</span>
          </li>
          <li>
            <span className="trait-name">刊次</span>
            <span>排版、印刷、权威、冷静。分层靠栏、线和纸的深浅，朱红只画规则和主动作。</span>
          </li>
          <li>
            <span className="trait-name">硬边</span>
            <span>硬、直白、高对比、当代。三像素实线，再加一块不模糊的偏移阴影。</span>
          </li>
        </ol>
      </section>

      <p className="colophon">依据和禁令写在仓库的设计说明里。这个页面只保留能点、能改、能对照的部分。</p>
    </>
  );
}
