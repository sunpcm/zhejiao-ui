# 当前决定

这份记录区分已经落实的实现判断与仍需用户或目标仓库确认的部分。

## 已落实

- 青格、刊次、硬边继续作为三种可比较视觉；青格是当前产品基线候选，最终审美未裁定。
- 视觉、明暗和版面保持独立轴。阅读、产品、运维不绑定任何视觉。
- 公开基础位于 `src/tokens.css`，公开变量为 `--zj-*`，公开作用域为 `data-zj-theme` / `data-zj-scheme`。
- 实验室旧的 `data-theme` / `data-scheme` 保留兼容，但旧变量集中桥接 `--zj-*`，不再重复维护六套基础色板。
- 明暗偏好支持 `system | light | dark`。无值、非法值和存储拒绝都回到系统模式；最终 `data-zj-scheme` 只写 `light | dark`。
- 首次加载会把有效偏好规范为 `system`，而不是把系统结果误写为显式浅色或深色。之后媒体变化仍会更新最终 scheme。
- 青格浅色主按钮从品牌青绿动作改为 `#0F6E66` 底、`#F4FFFD` 字；品牌青绿 `#12A594` 继续作 accent。
- 普通弱化文字与选中态弱化文字分别有语义 token。自动回归采样真实 `.ticket-meta` 的普通和选中表面，二者都要求至少 `4.5:1`。
- 输入边界使用 `--zj-color-border-strong`，焦点使用 outline；回归同时检查边界、焦点和主动作 hover。
- 表格与表头字号随版面密度继承，运维 14px 时二者也保持 14px。
- 阅读行长采用 `--zj-measure-reading: 36ic`，窄屏回落到可用宽度。
- 对话框使用原生 modal dialog，回调存入 ref，避免父级 toast 重渲染重跑打开 effect 并重置焦点；只有边界外点击算 backdrop，内部 padding 不关闭。
- `/patterns` 提供 echotalk 与 Nexty 风格的本地交互样张，覆盖正常、空、加载、错误状态，不发起服务请求；重试状态不会清空用户输入、消息或已生成草稿。
- echotalk 与 Nexty 各提供一份 opt-in adapter CSS；默认作用域未开启 adapter 时不生效。三属性命中选择器的 specificity 高于常见宿主 `:root`、`.dark` 和 `:root[data-theme]`，不依赖 `!important`。
- `tokens.css` 的 `color-scheme` 只在显式主题 scope 出现；未被目标应用 opt-in 的宿主保持自己的 scheme。每个主题 scope 都恢复本地字体、圆角、密度与动效基础角色。
- Node 最低版本跟随当前 Vite 锁依赖：`^20.19.0 || >=22.12.0`。
- 回归使用 Playwright，覆盖系统偏好、启动脚本原型键、存储异常、路由密度、六套真实对比度、选中气泡及其辅助文字、四种样张状态、重试内容保留、modal 焦点与内部留白、真实宿主和 inline adapter、no-opt-in scheme、嵌套主题角色、390px 溢出与 reduced-motion。

## 跨仓边界

- Nexty 当前公共 UI 入口是 `@sunpcm/niu-ui`。其 `packages/ui/src/theme.css` 已被目标仓确认为直接 `@theme inline` 映射；`apps/web/src/styles/globals.css` 仍有旧 `hsl(var(...))` 映射，需由目标仓按实际导入链清理冲突。
- 上述旧映射的潜在冲突不等于已经证实线上色值故障。本轮只提供 adapter 和接入说明。
- Nexty 的 `.dark` / next-themes 保留，由应用把状态桥接到 `data-zj-theme` 与 `data-zj-scheme`。
- echotalk 的 `data-theme=warm|cool|dark` 保留语义，由应用桥接，不把 `dark` 当视觉主题名，也不把 `warm|cool` 写进公开 `data-zj-theme`。
- root 和 portal 必须处于同一 token scope；只改 React 子树而遗漏 body portal，不会自动继承该子树的 CSS 自定义属性。

## 仍需确认

- 用户最终采用青格、刊次、硬边中的哪套主视觉，还是继续比较。
- echotalk 的 warm/cool 与青格/刊次怎样形成产品级映射；本轮只定义桥接边界。
- Nexty 在目标仓库的实际导入顺序和旧映射清理方式。本轮不跨仓修改。
- 外网字体是否在正式部署中启用证书已审的本地托管版本。当前设计只要求系统中文后备始终可用。
- 是否在目标应用中发布或版本化 adapter。本仓库只暴露文件，不发布 npm 包。
