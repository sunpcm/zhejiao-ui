# 决定

分两列：已经按简报落下去、建议保留的；以及这次为了能用而做的判断，建议你确认。来源和本次判断分开写。

## 建议保留

- 三套主题锁死，不合成第四套：青格 `qingge`、刊次 `kanci`、硬边 `yingbian`。
- 同一套工单台：`/` 说明、`/gallery` 组件、`/board` 工作台。切换主题不清除筛选和选中。
- 技术栈是 Vite + React + TypeScript + CSS 变量。不用 Tailwind，不用组件库默认紫。
- 分层各用一种：青格短阴影，刊次线和纸层，硬边 3px 实线加 `6px 6px 0` 无模糊阴影。
- 文案用简体中文。字体从 Google Fonts 和 Fontshare 加载，西文在前、Noto 在后。
- 不部署，不发布到 Vercel 或任何托管。
- 仓库不加开源许可证。
- 上一版 PR #1（折角，分支 `cursor/zhejiao-ui-demo-bebb`）保持独立，不在那条分支上改视觉，也不把两套 PR 合并。它只作为已经否定的方向留在那里。
- **两根轴，已确认。** 视觉主题仍是青格、刊次、硬边，加上浅色和深色。版面是另一根轴：阅读、产品、运维，写在 `data-surface`，三套主题都能用。建议搭配只写在文档里，界面不锁定、也不默认绑死。技术栈仍是 Vite + React + TypeScript + CSS 变量，这一步不迁到 Tailwind。

## 建议你确认

1. **硬边字体。** Clash Display 和 Satoshi 来自 Fontshare，需要网络，许可证是 ITF Free Font License。若不能依赖 Fontshare，硬边要换西文，但不要换成 Inter。中文仍然用 Noto Sans SC。
2. **青格浅色按钮的对比。** 填充按简报用 `#12A594`，字用近白 `#F4FFFD`，对比大约 3.0:1，不够正文的 4.5:1。小字链接改成同色相的 `#0F6E66`（约 5.7:1）。实心按钮的焦点环改用正文色，其余焦点仍是青绿。若你希望按钮文字也严格保持近白、链接也严格用 `#12A594`，需要接受小字对比不足。
3. **深色强调色的具体提亮。** 简报要求深色青绿和朱红提高对比，但没有给十六进制。这次用青格 `#2BBBAD`、刊次 `#E25A54`。色相仍是青绿和朱红，不是霓虹。深色主按钮配深色字，因为提亮之后近白字会更看不清。
4. **主题的中文名。** 界面用青格、刊次、硬边；`data-theme` 用 `qingge`、`kanci`、`yingbian`。
5. **上一版要不要只作对照。** 建议保留 PR #1 不合并。本 PR 不包含折角，也不包含那一版的色值。
6. **许可证。** 建议继续不加。Fontshare 字体本身带 ITF 许可，那是字体的许可，不是这个仓库的开源许可证。
7. **部署。** 建议继续不部署。本地是 `npm install` 然后 `npm run dev`，地址是 <http://127.0.0.1:5173/>。
8. **明暗的记忆方式。** 第一次没有保存记录时跟随系统。之后以 `localStorage` 为准，不再随系统改变。工单数据不写入本地，刷新回到初始十条。
9. **运维字号。** 产品和阅读仍不小于 16px。运维为了更密，界面用 14px。若你希望三档都不低于 16px，运维就只能靠间距变密，字号不再降。
10. **版面的默认值。** 没有保存记录时用产品，不按当前主题去猜阅读或运维。
11. **旧地址。** `/board` 转到 `/product`。阅读是 `/reading`，运维是 `/infra`。
12. **运维状态色。** 绿、黄、红只表示通断和缓急，色值与三套主题的强调色分开。浅色大约 `#0C7A43` / `#8A5A00` / `#9F1239`，深色大约 `#3DDC97` / `#E6B15A` / `#FF8D86`。

## 来源

方法、禁令和一部分色值来自这些页面，不是把它们的组件或主题目录拷进来：

- https://github.com/samber/cc-skills/blob/main/skills/frontend-design-deslop/SKILL.md
- 同仓库的 typography、token-sets、aesthetics-library
- https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md
- https://github.com/anthropics/claude-cookbooks/blob/main/coding/prompting_for_frontend_aesthetics.ipynb
- https://github.com/JasonColapietro/anti-slop-templates
- https://github.com/google-labs-code/design.md/

工艺参考，没有当作视觉稿，也没有安装：

- https://github.com/pbakaus/impeccable
- https://github.com/Nutlope/hallmark
- https://github.com/Leonxlnx/taste-skill
- https://github.com/Darcos-Loft/fluid

deslop 写明：2026 年奶油底加斜体衬线英雄区已经是新套路；Space Grotesk、Geist、Instrument Serif 没有明确意图就不要用。三套都没用它们当主字体。刊次改用冷灰纸和朱红，不用暖奶油。

## 本次判断

这些不是来源里现成的结论：

- 产品内容是「工单台」，工单文案、受理人和状态流是这次写的。
- 三套中文名按简报使用，没有再改名。
- 青格链接色 `#0F6E66`、深色 `#2BBBAD`、刊次深色 `#E25A54` 是为对比补上的具体值。
- 硬边深色底用 `#111111`，边和阴影用 `#FFFDF5`。
- 硬边的小标签只有 3px 描边，没有再造一把更小的偏移阴影，避免和 `6px 6px 0` 的签名打架。按钮、工单、面板、对话框和提示仍是这把阴影。
- 首字下沉只放在说明页。组件页和工作台不再用，避免把工单台做成杂志封面。
