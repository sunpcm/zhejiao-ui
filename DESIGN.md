# 个人 UI 基础设计契约

本仓库用同一套工单、对话和创作样张比较三套视觉、浅色/深色与三档版面。青格是当前产品基线候选，刊次和硬边用于持续比较；最终审美尚未裁定。实现以 [src/tokens.css](src/tokens.css) 的公开语义为先，实验室外观再由 [src/styles.css](src/styles.css) 桥接。

## 作用域

公开使用只依赖两个主题属性：

```html
<html data-zj-theme="qingge" data-zj-scheme="light">
```

- `data-zj-theme`：`qingge | kanci | yingbian`
- `data-zj-scheme`：最终生效的 `light | dark`
- `data-zj-scheme-mode`：运行时偏好 `system | light | dark`，属于行为层，不属于 token 文件

`tokens.css` 不允许加入 reset、页面布局、网络字体或应用依赖。实验室继续使用旧 `data-theme` / `data-scheme` 选择器，但基础色板只维护一次，旧变量通过 `--zj-*` 集中桥接。

公开 token 不要求宿主 opt-in 就有任何 `color-scheme` 副作用；原生控件 scheme 只跟随显式 `data-zj-theme` / `data-zj-scheme`。任一主题 scope 都必须恢复完整的字体、圆角、密度与动效角色，嵌套青格时不能继承外层刊次或硬边的字体和直角。

## 语义 token

公开变量统一使用 `--zj-` 前缀。稳定的语义分组包括：

- `--zj-color-canvas`、`surface`、`surface-raised`、`surface-muted`、`selected`
- `--zj-color-text`、`text-muted`、`selected-text`、`selected-muted`
- `--zj-action-bg`、`action-fg`、`action-hover-bg`、`action-hover-fg`
- `--zj-color-focus`、`border`、`border-strong`、`danger`、状态色
- `--zj-font-*`、`--zj-radius-*`、`--zj-space-*`、`--zj-density-*`
- `--zj-measure-reading`、`--zj-focus-*`、`--zj-motion-*`

颜色语义按用途命名。品牌青绿属于 `accent`，可读的实心动作属于 `action`。弱化状态要同时覆盖普通表面和选中表面，不能只保证一种表面。

## 可读性

正文、普通弱化文字、选中态弱化文字、主动作文字与 hover 文字在六套组合中的设计底线都是 `4.5:1`。输入边界和焦点指示相对相邻表面至少 `3:1`。

青格浅色保留品牌青绿 `#12A594` 作点缀；主动作使用更深的 `#0F6E66` 与 `#F4FFFD`，避免把品牌色直接当作所有尺寸都可用的按钮色。其它主题同样把强调色和动作色分开处理。

面板、工单、选中态、按钮与输入都必须用浏览器计算后的真实颜色做回归。测试采样表面包含普通与选中态，不以组件名或源码字符串推断通过。

## 排版与密度

- 产品和阅读正文不小于 16px，阅读正文为 18px、行高 1.75。
- 阅读行长使用约 `36ic`，窄屏为 `min(100%, 36ic)`。`ic` 是当前字体中“水”字前进宽度，不能把 `ch` 的单位数当作汉字数。
- 运维正文为 14px、行高 1.45；表格与表头使用 `--zj-font-size-table` 和密度 padding，不固定 16px。
- 西文字体放在字体栈前面，中文依次回落后备到 `Noto Sans SC` 或 `Noto Serif SC`、苹方、微软雅黑等系统字体。
- 在线字体只增强呈现。断网或字体拒绝时，中文系统栈仍必须可用。
- 中文标签使用正常中文，不用全大写拉丁字母和人为字距伪装层级。

## 版面

版面只改变密度和信息结构，不更换视觉主题的色板、字体性格和圆角分层：

- `reading`：18px 正文、1.75 行高、更松间距、更高控件。
- `product`：16px 正文、台账与表单的常规密度。
- `infra`：14px 正文、32px 控件、紧凑日志与状态区；表格继承 14px。

主题与版面是两个独立轴。深链 `/reading`、`/product`、`/infra` 必须与对应版面一致；在非深链页面可只调整疏密。

## 交互

- 一处只放一个主动作；取消、返回和辅助动作使用次按钮或安静按钮。
- 焦点只用清晰 outline，不使用额外阴影冒充焦点。实心按钮、浅底和深底都要可见。
- 动效默认使用 token 时长与曲线。`prefers-reduced-motion: reduce` 时必须关闭过渡与对话框动画。
- 状态色只表达成功、警告、错误与危险，不拿来装饰。
- 表单必须有中文校验，错误靠近字段，并保留可恢复路径。
- 对话框使用原生 `<dialog>.showModal()`：背景 inert、Escape、Tab/Shift+Tab 焦点循环、关闭后恢复触发按钮。父组件重渲染不得重置当前对话框焦点；只有对话框边界外的 backdrop 点击可以关闭，内部留白和正文不算 backdrop。

## 三套视觉

三套是可比较方向，不是已经裁定的最终品牌系统。

### 青格 qingge

克制、清晰、网格、当代。短阴影与表面明度差形成层级，青绿用于链接、焦点和主动作。主动作与品牌点缀分离，保证小字可读。它是当前产品基线候选，仍可被用户最终否决或调整。

### 刊次 kanci

排版、印刷、权威、冷静。栏、线、字号和纸层形成层级，朱红只用于规则、链接和主动作。中文长文使用中文衬线后备，界面控件使用中文无衬线后备。

### 硬边 yingbian

硬、直白、高对比、当代。三像素实线与无模糊偏移阴影是签名；浅色与深色都保持粗边、直角和明确层级。按下反馈短促，不使用弹性或弹跳。

## 产品样张

`/patterns` 中文名为“产品样张”，在同一主题状态下并排展示：

- echotalk 式对话、消息列表与输入；
- Nexty 式创作表单、草稿和预览；
- 正常、空、加载、错误四种本地状态；
- 可执行的本地表单动作。

页面明确标注固定样例数据，不发出模型、聊天或创作网络请求。样张用产品结构检查 token，不用营销首屏或装饰遮住信息层级。

场景切换和“重试本地样例”只改变示例状态，保留用户已输入、已发送和已生成的内容。普通消息、选中消息、弱化辅助文字与四种状态文字都用最终渲染色检查对比度。

## 适配边界

echotalk 与 Nexty/biubiuniu 的适配是 opt-in CSS，不默认污染目标应用。目标应用的 `.dark`、next-themes、`data-theme=warm|cool|dark` 与公开 `data-zj-*` 属性由应用状态桥接。具体接线和 root/portal 约束见 [docs/ADOPTION.md](docs/ADOPTION.md)。

adapter 在公开 theme/scheme/adapter 三属性同时命中时，用无 `!important` 的更高 specificity 映射宿主变量，因此真实 `:root`、`.dark` 和 `:root[data-theme]` 规则不会把它带回错误色板；加载顺序和 inline scope 仍有明确约定。

本轮没有跨仓修改，也没有声称任一目标应用已经完成集成。
