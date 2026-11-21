---
name: zhejiao-theme
description: 在折角界面实验室中复用青格 qingge、刊次 kanci、硬边 yingbian，以及阅读 reading、产品 product、运维 infra 的公开 token。先读 DESIGN.md 与 src/tokens.css；最终审美尚未裁定。
---

# 折角个人 UI 基础

修改界面或迁移 token 前：

1. 读根目录 `DESIGN.md`、`DECISIONS.md`、`src/tokens.css` 和任务对应的 adapter。
2. 视觉使用 `data-zj-theme="qingge|kanci|yingbian"`，最终明暗使用 `data-zj-scheme="light|dark"`。实验室旧 `data-theme` / `data-scheme` 只是兼容桥。
3. 青格是当前产品基线候选，不是已经裁定的唯一品牌。刊次和硬边仍要可比较；不要新增第四套视觉，也不要把它们折中。
4. 版面使用 `data-surface="reading|product|infra"`。版面只改密度与结构，不改色板、字体性格、圆角或阴影公式。
5. 优先使用 `--zj-*` 语义 token。品牌 accent 与可读 action 分开；普通弱化文字和选中态弱化文字都要达到 `4.5:1`。
6. 主动作一处一个。焦点只用清晰 outline；输入边界要明显；`prefers-reduced-motion` 时关闭动效。
7. 对话框优先使用原生 modal dialog，并保持背景 inert、Escape、焦点循环、关闭后恢复触发焦点，父级重渲染不能重置对话框焦点。
8. echotalk 的 `data-theme=warm|cool|dark` 和 Nexty 的 `.dark` / next-themes 由目标应用桥接。adapter 只有在 `data-zj-theme`、`data-zj-scheme` 与显式 `data-zj-adapter` 同时命中时才生效，并以无 `!important` 的更高 specificity 覆盖常见宿主根变量；root/portal 必须同一 scope。
9. 中文字体优先走系统后备；在线字体只做增强。长文使用约 `36ic`，不要把 `ch` 数宣传成汉字数。
10. 本地样张必须明确固定数据，不能假装已经接上真实服务。
