# 工单台 · 主题实验室

同一套内部工单台。视觉和版面是两根轴，用来并排看，不用来折中，也不绑在一起。

| 视觉 | `data-theme` | 一句话 |
| --- | --- | --- |
| 青格 | `qingge` | 克制、清晰、网格、当代 |
| 刊次 | `kanci` | 排版、印刷、权威、冷静 |
| 硬边 | `yingbian` | 硬、直白、高对比、当代 |

| 版面 | `data-surface` | 一句话 |
| --- | --- | --- |
| 阅读 | `reading` | 长文，一行大约 65 个字 |
| 产品 | `product` | 台账、表格和表单 |
| 运维 | `infra` | 状态、数字和日志，再紧一档 |

页面是 `/` 说明、`/reading` 阅读、`/product` 产品、`/infra` 运维、`/gallery` 组件。`/board` 会转到 `/product`。三套视觉共用工单、筛选和选中。选择记在这台浏览器的 `localStorage`（`zhejiao-theme`、`zhejiao-scheme`、`zhejiao-surface`）。

建议搭配只是提示：刊次常用来读，青格常用来管台账，硬边常用来看状态。页眉可以随便组合。

## 运行

需要 Node.js 20 或更新版本。字体从 Google Fonts 和 Fontshare 加载，开发时要能访问这两处。

```bash
npm install
npm run dev
```

开发服务器固定在 <http://127.0.0.1:5173/>。端口被占用时会直接失败，不会悄悄改端口。

```bash
npm run build
npm run preview
```

`preview` 使用 <http://127.0.0.1:4173/>。

## 切换

页眉可以换视觉主题、明暗和版面。在阅读、产品、运维这三页里换版面，会带到对应的那一页；在说明和组件上换版面，只改疏密，留在当前页。说明页上的三块样张固定为各自的浅色，用来对照视觉；点样张会把整站换成那一套。样张本身不变成深色，也不代表版面。

第一次打开、还没有保存过明暗时，跟随系统的 `prefers-color-scheme`。一旦选过，就以本地保存为准，不再跟着系统变。刷新后主题还在。工单改动只留在当前这次打开里，刷新会回到初始的十条。

## 把一套带走

1. 打开 `DESIGN.md`，复制目标主题的 token。不要把另外两套的色值和圆角混进去。
2. 在目标页面的根节点设置 `data-theme="qingge|kanci|yingbian"`、`data-scheme="light|dark"`，需要版面时再加 `data-surface="reading|product|infra"`。版面不改变上一套的色值和字体。
3. 字体按 `index.html` 里的链接加载，并用 `DESIGN.md` 里的字体栈：西文在前，Noto 在后。Google Fonts 的样式表已经按 `unicode-range` 拆分，汉字会落到 Noto，不会整页掉进西文字体。
4. 组件外观以 `src/styles.css` 里该主题的选择器为样本。分层方式不要换：青格只用短阴影和明度差，刊次只用线和纸层，硬边只用 3px 实线和 `6px 6px 0` 的无模糊阴影。
5. 把 `.cursor/skills/zhejiao-theme/SKILL.md` 拷到目标仓库，让之后的修改先读 `DESIGN.md`。

## 文档

- `DESIGN.md`：三套 token、理由、禁令和来源
- `DECISIONS.md`：建议保留的决定，以及需要你确认的点
- `.cursor/skills/zhejiao-theme/SKILL.md`：按锁定主题继续做界面

这个仓库不部署，也不附带开源许可证。
