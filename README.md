# 折角界面实验室 · 个人 UI 基础

这是一个轻量的个人 UI 基础与比较现场。工单台、对话和创作工作区都是样张，用来检查 token、中文排版、信息密度和交互状态，不是仓库的最终产品定位。

青格目前是产品基线候选，刊次和硬边继续作为可比较方向。三种视觉都保留浅色、深色与三档版面；用户最终审美尚未裁定。

## 两根轴

| 视觉 | 公开属性 | 用途 |
| --- | --- | --- |
| 青格 `qingge` | `data-zj-theme="qingge"` | 当前产品基线候选，克制、清晰、网格、当代 |
| 刊次 `kanci` | `data-zj-theme="kanci"` | 排版、印刷、权威、冷静的比较方向 |
| 硬边 `yingbian` | `data-zj-theme="yingbian"` | 硬、直白、高对比的比较方向 |

| 明暗模式 | 公开属性 | 行为 |
| --- | --- | --- |
| 系统 | `data-zj-scheme-mode="system"` | `data-zj-scheme` 跟随 `prefers-color-scheme` |
| 浅色 | `data-zj-scheme-mode="light"` | 显式浅色并持久化 |
| 深色 | `data-zj-scheme-mode="dark"` | 显式深色并持久化 |

| 版面 | 公开属性 | 用途 |
| --- | --- | --- |
| 阅读 `reading` | `data-surface="reading"` | 正文 18px、较松间距、约 36ic 行长 |
| 产品 `product` | `data-surface="product"` | 正文 16px、台账、表格和表单 |
| 运维 `infra` | `data-surface="infra"` | 正文和表格 14px、状态、数字和日志 |

视觉与版面互不绑定。青格、刊次、硬边都能使用阅读、产品、运维。公开 token 只认 `data-zj-theme` 与 `data-zj-scheme`；实验室自己的 `data-theme`、`data-scheme` 仅作为兼容桥。

## 页面

- `/`：说明与三种视觉样张
- `/reading`：阅读版面
- `/product`：工单产品版面；旧地址 `/board` 会重定向到这里
- `/infra`：运维版面
- `/gallery`：组件、表单、表格、提示和原生对话框
- `/patterns`：中文名为“产品样张”的 echotalk 对话与 Nexty 创作工作区样张

`/reading`、`/product`、`/infra` 的深链会在启动脚本和 React 路由生效后同步版面。其它页面可以临时切换疏密而不离开当前页。

## 运行与验证

项目要求的 Node 最低版本由当前 Vite 锁依赖决定，精确为 `^20.19.0 || >=22.12.0`：

```bash
npm ci
npm run dev
```

开发服务器固定在 <http://127.0.0.1:5173/>，端口占用时直接失败。

```bash
npm run typecheck
npm run build
npx playwright install chromium
npm run test:browser
npm run check
npm run preview
```

`npm run check` 依次执行类型检查、生产构建和 Playwright 回归。CI 使用 Node 22.12.0、`npm ci`、构建和 Chromium 测试。预览地址是 <http://127.0.0.1:4173/>。

## 主题状态

没有有效存储时默认使用青格与产品版面，明暗模式为“系统”。启动脚本先给出合法的预渲染属性，React 随后接管同一状态。用户选择显式浅色或深色时持久化该选择；选择“系统”会重新跟随媒体变化。存储被拒绝或数据无效时会安全回到默认，不产生非法主题属性。

本地存储键为：

- `zhejiao-theme`
- `zhejiao-scheme`，取值为 `system | light | dark`
- `zhejiao-surface`

## 复用 token 与 adapter

可移植的公开基础在 `src/tokens.css`，只包含变量、字体栈、密度与作用域内的 `color-scheme`；没有 `data-zj-*` 的宿主不会被强制切换明暗。包的 `exports` 和 `files` 暴露 token 及两个 opt-in adapter：

```ts
import "zhejiao-ui/tokens.css";
import "zhejiao-ui/adapters/echotalk.css";
import "zhejiao-ui/adapters/nexty.css";
```

adapter 只有同时命中 `data-zj-theme`、`data-zj-scheme` 和对应的 `data-zj-adapter` 才生效。其选择器可覆盖常见的 `:root`、`.dark` 与 `:root[data-theme]` 宿主变量，不使用 `!important`；仍应让 adapter 在宿主主题规则之后加载。不要把两个 adapter 都应用到错误作用域，也不要仅映射 base token 就声称目标应用已经完成迁移。

接入步骤、echotalk 的 `data-theme=warm|cool|dark` 桥接、Nexty 当前的 `@sunpcm/niu-ui` 入口、next-themes 与 Tailwind v4 映射见 [docs/ADOPTION.md](docs/ADOPTION.md)。

字体外链只做视觉增强。中文系统字体后备始终可用，外网字体不是运行前提。本仓库不部署，也不附带开源许可证。

## 文档

- [DESIGN.md](DESIGN.md)：token、排版、密度与交互契约
- [DECISIONS.md](DECISIONS.md)：当前决定、迁移边界和待确认事项
- [docs/ADOPTION.md](docs/ADOPTION.md)：echotalk 与 Nexty/biubiuniu 的 opt-in 接线
- [docs/RESEARCH.md](docs/RESEARCH.md)：指定官方资料的学习点与不照搬边界
- `.cursor/skills/zhejiao-theme/SKILL.md`：在此仓库修改界面时的轻量规则
