import { Link } from "../router";

const snippet = `.btn-primary {
  background: var(--accent);
  color: var(--accent-ink);
  border-radius: var(--radius-control);
}`;

function Dogear() {
  return (
    <svg className="dogear" viewBox="0 0 40 40" width="40" height="40" aria-hidden="true">
      <polygon points="0,0 40,40 30,40 0,10" fill="var(--fold)" />
      <polygon points="0,0 40,0 40,40" fill="var(--bg)" />
      <polyline
        points="0,0 40,40"
        fill="none"
        stroke="var(--line)"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export function Home() {
  return (
    <article>
      <h1 id="page-title" className="page-title" tabIndex={-1}>
        折角
      </h1>
      <p className="lede">
        折角是一套固定的界面主题。底是青灰纸，字是带绿的墨，强调色是偏蓝的青绿。同一屋里的工具共用这一套，不再每次重新长出一种样子。
      </p>

      <div className="home-grid">
        <div className="stack">
          <section className="stack" aria-labelledby="about-title">
            <h2 id="about-title" className="doc-title">
              这是什么
            </h2>
            <p className="prose">
              Spec Loop、StoreWatch、EchoTalk，以及后面新的小工具，都从这里取色板、字号和边线。页面要像一份折过的文档被拿来办事：能扫读，边线清楚，安静。
            </p>
            <p className="prose">
              右上角可以在浅色和深色之间换。两套只用颜色区分，字号和圆角不变。没有第三套主题。
            </p>
          </section>
          <section className="stack" aria-labelledby="rules-title">
            <h2 id="rules-title" className="doc-title">
              使用时守三条
            </h2>
            <ol className="steps">
              <li>先对 token 的名字，再写组件。不要在组件里新写色值。</li>
              <li>文案用工具里真会出现的中文，例如需求走到交付、店铺巡检、会话记录。</li>
              <li>折角只出现一次。这一页右上角那张纸就是这一次。</li>
            </ol>
          </section>
        </div>

        <section className="sheet-fold stack" aria-labelledby="copy-title">
          <Dogear />
          <h2 id="copy-title" className="doc-title">
            拷到别的仓库
          </h2>
          <ol className="steps">
            <li>复制 src/tokens.css，在入口整份引入。</li>
            <li>沿用 index.html 里的三套字体：Noto Sans SC、Noto Serif SC、IBM Plex Mono。</li>
            <li>把 .cursor/skills/zhejiao-ui/ 拷到目标仓库的同样路径。</li>
            <li>让代理先读 SKILL.md 和 DESIGN.md，再动界面。</li>
          </ol>
          <pre>
            <code>{snippet}</code>
          </pre>
        </section>
      </div>

      <section className="ban" aria-labelledby="ban-title">
        <h2 id="ban-title" className="doc-title">
          不要用
        </h2>
        <ul className="ban-list">
          <li>把 Inter、Roboto、Open Sans、Lato、Arial 或 Space Grotesk 当界面字体。</li>
          <li>紫色或靛色渐变、渐变字、发光按钮。</li>
          <li>卡片套卡片，或所有东西都用大圆角加软阴影。</li>
          <li>每张卡悬停抬起，每一段都淡入再上移。</li>
          <li>用表情当图标。全大写字距眉题。装饰用的 01、02、03。</li>
          <li>Introducing、The future of 这类句子。</li>
          <li>奶油底加赤陶色。纯黑底加荧光绿。报纸通栏的仿古排版。</li>
        </ul>
      </section>

      <div className="next-links">
        <p className="prose">
          <Link href="/gallery">看组件怎么落到真实句子上</Link>
        </p>
        <p className="prose">
          <Link href="/board">打开文档成环工作台</Link>
        </p>
      </div>
    </article>
  );
}
