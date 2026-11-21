# 接入说明

本仓库提供公开 token 和两份 opt-in CSS adapter，没有发布 npm 包，也没有完成任何目标仓库集成。接入时先确认目标仓的实际入口、导入顺序和主题状态所有权，再选择复制文件或通过本地工作区依赖消费。

## 共同前提

至少把两个公开属性放在同一个主题根节点：

```html
<html data-zj-theme="qingge" data-zj-scheme="dark" data-zj-adapter="nexty">
```

- `data-zj-theme`：`qingge | kanci | yingbian`
- `data-zj-scheme`：最终生效的 `light | dark`
- `data-zj-adapter`：`echotalk | nexty`，只有目标适配器需要

模式偏好 `system | light | dark` 属于应用状态。若应用提供模式选择，可额外映射 `data-zj-scheme-mode`，但 `tokens.css` 本身不监听媒体查询。

CSS 自定义属性沿 DOM 树继承。独立 document/iframe 不共享作用域；Shadow DOM 可从进入该树的 host 继承自定义属性，但选择器不能跨 shadow boundary，host 本身必须处于主题 scope。React portal 若挂在 `document.body`，要么把主题属性和 adapter 放到 body，要么把 portal 放到处于同一 token scope 的容器；只包裹一个 React 子树不会覆盖 body 下另一个 portal。

两份 adapter 只在公开主题属性与 `data-zj-adapter="..."` 同时命中时生效。选择器 specificity 高于目标应用常见的 `:root`、`.dark` 和 `:root[data-theme]` 宿主变量，但不使用 `!important`；adapter 样式仍应放在目标主题规则之后加载，避免同等或更高 specificity 的宿主规则覆盖它。不要全局无条件导入后就认为应用已经改色。

## echotalk

adapter 位于 `src/adapters/echotalk.css`，把现有变量映射为：

- `--bg`、`--surface`、`--surface-elevated`
- `--text`、`--text-muted`
- `--accent`、`--accent-contrast`、`--accent-hover`
- `--danger`、`--danger-contrast`
- `--border`、`--border-strong`、`--focus`
- `--success`、`--warning`、`--selection`

echotalk 已有的 `data-theme="warm|cool|dark"` 继续由目标应用拥有。至少一个宿主节点还要同时维护 `data-zj-theme` 和 `data-zj-scheme`：

```html
<div
  data-theme="cool"
  data-zj-theme="qingge"
  data-zj-scheme="light"
  data-zj-adapter="echotalk"
>
```

建议由目标应用的状态桥接函数生成映射，例如 warm/cool 选视觉，dark 选深色模式；不要简单把字符串 `dark` 写进 `data-zj-theme`。映射策略没有在本轮裁定。

```ts
root.dataset.zjTheme = productTheme === "warm" ? "kanci" : "qingge";
root.dataset.zjScheme = echotalkTheme === "dark" ? "dark" : "light";
root.dataset.zjAdapter = "echotalk";
```

目标应用仍负责自己的主题持久化、媒体监听和清理。不要在 adapter 中重复创建监听。

## Nexty / biubiuniu

Nexty 当前公开 UI 名称是 `@sunpcm/niu-ui`。目标仓的公共样式入口是 `@sunpcm/niu-ui/styles.css`；`packages/ui/src/theme.css` 使用完整的直接 `@theme inline` 映射。

`apps/web/src/styles/globals.css` 仍有旧 `hsl(var(...))` 映射。接入时先按目标仓实际导入顺序找出重复定义，移除冲突的旧映射，保留 `packages/ui/src/theme.css` 中正确的直接映射。这是待目标仓处理的潜在冲突，不能表述为已经证实的线上色值故障。

保留 next-themes 与 `.dark`。应用负责把它们桥接到公开属性：

```html
<html
  class="dark"
  data-zj-theme="qingge"
  data-zj-scheme="dark"
  data-zj-adapter="nexty"
>
```

不要用 adapter 替换 next-themes，也不要让两个库各自维护一套互不相知的持久化。

Nexty 的 shadcn 变量映射位于 `src/adapters/nexty.css`：

- 背景/文字：`--background`、`--foreground`
- 卡片与浮层：`--card`、`--card-foreground`、`--popover`、`--popover-foreground`
- 动作：`--primary`、`--primary-foreground`
- 弱化：`--muted` 是背景，`--muted-foreground` 是文字
- 选中：`--accent`、`--accent-foreground`
- 危险与边界：`--destructive`、`--destructive-foreground`、`--border`、`--input`、`--ring`
- `--sidebar-*` 与 chart 变量

绝对不要把 `--muted` 当文字色，也不要把 `--muted-foreground` 当表面色。

### Tailwind v4

如果目标应用自己声明颜色主题，使用完整 CSS color 的直接映射：

```css
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
}
```

不要写 `hsl(var(--primary))` 把完整 `hex` 或 `oklch()` 色值再次包进 `hsl()`。目标现有 `theme.css` 若已是正确直接映射，应保留并在 app 入口清理重复旧写法，而不是复制出第二套映射。

## 导入与验证

典型顺序是：

```ts
import "@sunpcm/niu-ui/styles.css";
import "./styles/globals.css";
import "zhejiao-ui/tokens.css";
import "zhejiao-ui/adapters/nexty.css";
```

`zhejiao` 的 token 与 adapter 必须位于目标主题规则之后，这样新增映射才能稳定覆盖宿主已有的同名变量。这里的 `zhejiao-ui` 路径对应本仓库 package `exports` 的示例，当前包仍是 private；不要假定已经发布到 registry。

若目标应用选择复制文件，可直接使用：

- `src/tokens.css` → `apps/web/src/styles/zhejiao-tokens.css`
- `src/adapters/nexty.css` → `apps/web/src/styles/zhejiao-nexty.css`
- `src/adapters/echotalk.css` → echotalk 对应样式目录中的 `zhejiao-echotalk.css`

复制后把这两个 import 路径替换为目标文件；保持先加载宿主主题与 globals，再加载 token 与 adapter。

验证时至少检查：

- 目标 root 与 body portal 的计算颜色来自同一 token scope；
- `.dark`、next-themes 或 `data-theme` 切换后，公开属性与最终 scheme 一致；
- 普通与选中态弱化文字分别达到设计底线；
- Tailwind 工具类能解析完整颜色，不出现无效 `hsl(oklch(...))`；
- 目标应用原有持久化、媒体监听清理和服务端首屏没有回归。
