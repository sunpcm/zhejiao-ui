import { useEffect } from "react";
import { Link } from "react-router-dom";
import { SURFACES, THEMES } from "../data";
import { useStore } from "../store";
import { useTheme } from "../theme";
import type { ThemeId } from "../types";

export function HomePage() {
  const { theme, scheme, surface, setTheme } = useTheme();
  const { pushToast } = useStore();
  const current = THEMES.find((item) => item.id === theme) ?? THEMES[0];
  const surfaceName = SURFACES.find((item) => item.id === surface)?.name ?? "产品";
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
          <h1>一套可带走的个人 UI 基础</h1>
          <p className="lede">
            <span className="drop">这</span>
            <span className="lede-body">
              里用青格、刊次、硬边三套可比较方向验证 token、中文排版、密度和交互状态。工单台是产品样张，不是仓库的最终定位；对话与创作工作区在
              <Link to="/patterns">产品样张</Link>
              继续检查，工单台账在<Link to="/product">产品</Link>。
            </span>
          </p>
          <p className="now">
            当前是{current.name}，{schemeName}，{surfaceName}。
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
              data-zj-theme={item.id}
              data-zj-scheme="light"
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

      <section className="block" aria-labelledby="surface-heading">
        <h2 id="surface-heading">版面</h2>
        <p className="section-note">
          版面管疏密和信息结构，不管颜色和字体。文档里的建议搭配只是提示，这里不锁定。
        </p>
        <ol className="surface-list">
          {SURFACES.map((item) => (
            <li key={item.id}>
              <Link to={item.path}>{item.name}</Link>
              <span>{item.line}</span>
            </li>
          ))}
        </ol>
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
