# 工单台视觉系统

三套锁定主题，共用同一套工单台。实现以 `src/styles.css` 为准。这份文件是契约：改界面时先读这里，不要另起一套，也不要把三套折中。

产品是内部工单台，不是文档产品，也不是「折角」。

## 共用

- 技术：Vite、React、TypeScript。主题用 `data-theme`，明暗用 `data-scheme`。不使用 Tailwind，也不用组件库的默认紫色。
- 正文不小于 16px。长文控制在约 65ch。行高随字号降低：16px 约 1.65，标题约 1.15–1.35。
- 中文标签用正常中文，不用全大写拉丁字距。
- 西文和汉字分开走：字体栈把西文家族放在前面，Noto 放在后面。Google Fonts 的 CSS 已按 `unicode-range` 分包。`font-display: swap`。每套页面的主层级不超过三个字重。
- 焦点只用 `outline`，不把焦点做成另一层阴影。浅底、深底、实心强调按钮上都要看得见。
- 动效只使用 `transform` 和 `opacity`。青格、刊次 180ms `ease-out`。硬边 80ms `linear`，按下时平移，不用弹性。`prefers-reduced-motion: reduce` 时去掉过渡。
- 状态色只表示状态。紧急和校验错误用危险色，不拿来装饰。
- 表单有中文校验。对话框可用按钮或 Escape 关闭。提示会自己消失。控件都能用键盘到达。

## 青格 qingge

克制、清晰、网格、当代。瑞士式的当代产品界面。

```yaml
id: qingge
adjectives: [克制, 清晰, 网格, 当代]
fonts:
  display: IBM Plex Sans
  body: IBM Plex Sans
  chinese: Noto Sans SC
  mono: IBM Plex Mono
  weights: [400, 500, 600]
radius:
  control: 4px
  panel: 6px
layering: 短阴影 + 表面与背景的明度差
signature: 严格对齐；青绿只出现在链接、主按钮和焦点；组内紧、组间松
motion: 180ms ease-out
light:
  bg: oklch(0.99 0 0)
  fg: oklch(0.22 0.01 250)
  muted: oklch(0.55 0.01 250)
  surface: oklch(0.955 0.004 250)
  line: oklch(0.9 0.005 250)
  accent: "#12A594"
  accentText: "#0F6E66"
  onAccent: "#F4FFFD"
  danger: "#9F1239"
  focus: "#12A594"
  shadow: 0 1px 2px oklch(0.22 0.01 250 / 0.10), 0 2px 6px oklch(0.22 0.01 250 / 0.05)
dark:
  bg: oklch(0.16 0.01 250)
  fg: oklch(0.96 0 0)
  muted: oklch(0.78 0.012 250)
  surface: oklch(0.22 0.014 250)
  line: oklch(0.32 0.012 250)
  accent: "#2BBBAD"
  accentText: "#2BBBAD"
  onAccent: "#06221F"
  danger: "#FF8B98"
  focus: "#2BBBAD"
```

浅色主按钮填充保持 `#12A594`，字用近白 `#F4FFFD`。这块对比大约 3.0:1，达不到正文 4.5:1，是锁定色和可读性之间的冲突，记在 `DECISIONS.md`。小字链接改用同色相的 `#0F6E66`（相对浅底约 5.7:1）。实心按钮上的焦点环改用正文色，避免和青绿填充糊在一起；其余焦点跟 `#12A594`。

深色把强调提到 `#2BBBAD`，仍然是青绿，不是霓虹。按钮上用深色字 `#06221F`（约 7:1）。链接和焦点用同一枚提亮的青绿。

面板、工单和次按钮只有短阴影，没有描边。输入框靠填色和背景的明度差分开，聚焦时只出现轮廓，不另加一圈阴影。

## 刊次 kanci

排版、印刷、权威、冷静。编辑排版，但避开暖奶油底和斜体衬线大标题。

```yaml
id: kanci
adjectives: [排版, 印刷, 权威, 冷静]
fonts:
  display: Source Serif 4
  body: Source Serif 4
  chineseLongform: Noto Serif SC
  ui: Noto Sans SC
  mono: IBM Plex Mono
  weights: [400, 600]
radius:
  control: 2px
  panel: 2px
layering: 栏、线、字号和纸层
signature: 标题下的一条朱红规则线；说明页可用首字下沉和引用破栏
motion: 180ms ease-out
light:
  bg: "#EEF1F3"
  fg: "#16171A"
  muted: "#3E4248"
  paper: "#F6F8F9"
  paperDeep: "#E2E7EA"
  accent: "#9B2335"
  onAccent: "#FFF7F7"
  danger: "#9B2335"
  focus: "#9B2335"
dark:
  bg: "#121315"
  fg: "#E6E2DA"
  muted: "#C4BEB4"
  paper: "#1C1E21"
  accent: "#E25A54"
  onAccent: "#1A0A0C"
  danger: "#E25A54"
  focus: "#E25A54"
```

不用 `#F7F5F2`，不用柿子橙，不用 Fraunces，不用斜体衬线英雄区。长文用衬线，导航、按钮、表单和表格用 Noto Sans SC。说明页有首字下沉，引用破到旁边一栏。组件页和工作台仍是工单台：栏与线，不是杂志封面，也不是圆角卡片墙。

浅色朱红 `#9B2335` 在冷灰纸上约 6.9:1，近白字在按钮上约 7.4:1。深色提到 `#E25A54`（在 `#121315` 上约 5.2:1），按钮用深色字。不要换成霓虹粉。

## 硬边 yingbian

硬、直白、高对比、当代。新粗野主义。

```yaml
id: yingbian
adjectives: [硬, 直白, 高对比, 当代]
fonts:
  display: Clash Display
  body: Satoshi
  chinese: Noto Sans SC
  mono: IBM Plex Mono
  weights: [400, 500, 700]
radius: 0
border: 3px solid current ink
shadow: 6px 6px 0 current ink
layering: 粗实线 + 无模糊偏移阴影
signature: 这道偏移阴影，不要改成软阴影
motion: 80ms linear，按下时向阴影方向平移
light:
  bg: "#FFFDF5"
  fg: "#000000"
  muted: "#2A2A2A"
  accent: "#FFC53D"
  onAccent: "#000000"
  accent2: "#29A383"
  danger: "#A11D2E"
  focus: "#000000"
dark:
  bg: "#111111"
  fg: "#FFFDF5"
  muted: "#E4E0D4"
  accent: "#FFC53D"
  onAccent: "#000000"
  accent2: "#29A383"
  danger: "#FF8D86"
  line: "#FFFDF5"
  shadow: 6px 6px 0 #FFFDF5
  focus: "#FFFDF5"
```

Clash Display 与 Satoshi 来自 Fontshare，许可证是 ITF Free Font License，不含汉字，所以中文走 Noto Sans SC。标题里的拉丁编号（如 `GD-1079`）用 Clash Display，用来把这套西文显示字体露出来。不要用 Inter。

琥珀 `#FFC53D` 上用黑字（约 13:1）。玉 `#29A383` 只用于「处理中」这类状态；它在奶油底上作为小字不够，状态文字若直接铺在奶油底上改用更深的玉，色块本身仍用 `#29A383` 配黑字。焦点是 3px 实线，偏移到边框外侧，浅色用黑、深色用浅色，避免细虚线消失在黑边上。

深色保持同一签名：近黑底、浅色字、浅色 3px 边、浅色无模糊偏移阴影。

## 禁令

三套都不要：

- 折角、蓝绿纸底单据，以及上一版那套色和签名
- Inter、Roboto、Open Sans、Lato、Montserrat、Poppins，或把系统字体当主字体
- Space Grotesk、Geist、Instrument Serif、Fraunces
- 紫或靛蓝渐变，渐变字，玻璃拟态，大面积灰雾阴影，悬浮抬起
- 三张一模一样的功能卡，眉题加彩色英文单词
- 用 emoji 当图标
- 在同一个元素上叠细线边框和弥散阴影
- 把青格或刊次的大面积底做成纯黑 `#000`（硬边的字和边用纯黑是签名的一部分）
- 弹性、弹跳动效

2026 年「奶油底 + 斜体衬线英雄区」已经是新套路。刊次故意不用这条路。

## 来源

这些来源提供方法和禁令，不是三套主题的视觉稿。没有把 Impeccable、Hallmark、Taste Skill、fluid 装进仓库，也没有拷它们的主题目录。

- [frontend-design-deslop](https://github.com/samber/cc-skills/blob/main/skills/frontend-design-deslop/SKILL.md)，以及其中的 typography、token-sets、aesthetics-library。青格的中性色接近 token set 4，强调色取 Radix Teal 9 `#12A594`。硬边的琥珀和玉接近 token set 3 / Radix Amber、Teal。
- [Anthropic frontend-design](https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md)
- [Prompting for frontend aesthetics](https://github.com/anthropics/claude-cookbooks/blob/main/coding/prompting_for_frontend_aesthetics.ipynb)
- [anti-slop-templates](https://github.com/JasonColapietro/anti-slop-templates)：同一套页面、多套锁定系统。没有使用 Folio / Suede 的品牌和色值。
- [design.md](https://github.com/google-labs-code/design.md/)：用 token 加理由写设计契约。这里覆盖三套，而不是一套。
- 只作工艺参考，不当视觉稿：[impeccable](https://github.com/pbakaus/impeccable)、[hallmark](https://github.com/Nutlope/hallmark)、[taste-skill](https://github.com/Leonxlnx/taste-skill)、[fluid](https://github.com/Darcos-Loft/fluid)
