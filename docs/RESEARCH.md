# 研究记录

本轮只参考任务指定的公开资料。目标是从成熟做法中提取轻量原则，不复制完整体系，也不把这些资料当成最终视觉裁定。

## DTCG Format 2025.10

来源：<https://www.designtokens.org/tr/2025.10/format/>

这是社区设计 token 格式规范，不是 W3C 正式标准。这里学习颜色、尺寸、字体等 token 的表达方式和语义分组思路；不生成 DTCG 图、不引入转换器，也不声称 `tokens.css` 完整兼容该格式。

## Adobe Spectrum

来源：<https://spectrum.adobe.com/page/design-tokens/>

学习基础值、语义别名与组件消费之间的分层，以及用语义而不是具体色相命名。未照搬 Spectrum 的完整 token 族、组件状态表或品牌视觉。

## GitHub Primer

来源：<https://primer.style/product/primitives/token-names/>

学习按背景、文字、边框、动作和焦点组织 token，并让不同表面拥有可检查的语义。未复制 Primer 的命名全集，也没有引入 GitHub 的界面语言。

## Radix Themes

来源：<https://www.radix-ui.com/themes/docs/overview/styling/>

学习强调色、背景层级、可访问前景和焦点角色的组织方式。未安装 Radix，不把其组件库或完整色阶当作本仓库依赖。

## shadcn 主题

来源：<https://ui.shadcn.com/docs/theming/>

学习 `background / foreground`、`primary / primary-foreground`、`muted / muted-foreground`、`ring` 等消费语义。Nexty adapter 保留这些变量名以降低迁移成本，但明确 `--muted` 是背景、`--muted-foreground` 是文字。未替换目标应用组件。

## Tailwind CSS theme

来源：<https://tailwindcss.com/docs/theme/>

学习 Tailwind v4 的完整 CSS 颜色可直接由 CSS 变量映射。接入示例使用 `@theme inline { --color-background: var(--background); }`，避免把已经完整的 `hex` 或 `oklch()` 再封装进 `hsl()`。未把实验室迁到 Tailwind。

## WAI 对比度

来源：<https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html>

普通文字采用至少 `4.5:1` 的目标。回归使用浏览器计算后的文字与表面颜色，并额外采样真实选中态，不只看主按钮或源码中的单个色值。焦点和非文字边界另按 `3:1` 目标检查。

## WAI modal dialog 模式

来源：<https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/>

学习 modal 的焦点进入、限制、关闭与返回触发控制的完整流程。本项目使用原生 `<dialog>.showModal()` 获得背景 inert 和浏览器 Escape 行为，再通过浏览器回归验证 Tab/Shift+Tab、程序化焦点隔离、toast 触发的父级重渲染与关闭后焦点恢复。
