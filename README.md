# 折角

折角是一套给家里工具共用的界面主题。Spec Loop、StoreWatch、EchoTalk 以及以后的小工具，都从这里取色板、字号和边线，不再每次让模型重新发明一套。

它是一份折过的文档长成的界面：青灰纸、细边线、紧圆角、偏蓝的青绿。用来办事，不是用来做官网。

## 本地运行

需要 Node.js 22 或更新版本。

```bash
npm install
npm run dev
```

浏览器打开终端里打印的本地地址，默认是 `http://localhost:5173`。

三个页面：

- `/` 说明：主题是什么、怎么拷走、不要用什么
- `/gallery` 组件：按钮、表单、表格、导航、标签页、对话框、提示、空状态、错误、徽章、链接
- `/board` 工作台：一个「文档成环」的小工具壳

```bash
npm run typecheck
npm run build
npm run preview
```

字体从 Google Fonts 加载：Noto Sans SC、Noto Serif SC、IBM Plex Mono。第一次打开需要网络，中文才会落到这三套字上。

## 拷贝令牌到别的项目

必须带走的是 `src/tokens.css`。在目标项目入口整份引入，不要把色值抄散到组件里。

同时抄 `index.html` 里的字体 `<link>`。界面用 Noto Sans SC，长文用 Noto Serif SC，数字和代码用 IBM Plex Mono。中文不要落到系统默认黑体以外的西文字体上。

`src/components.css` 是这套组件的写法样本。选择器绑着这个 demo 的结构，不要整份丢进另一个项目还指望能用。需要按钮或表格时，按里面的用法，用令牌重写一小节。

色值、字号、间距、圆角、动效和禁则的全文在 [DESIGN.md](DESIGN.md)。

## 挂上 Cursor 技能

把 `.cursor/skills/zhejiao-ui/` 整个目录拷到目标仓库的同样路径。技能文件是 `.cursor/skills/zhejiao-ui/SKILL.md`。

在那个仓库里干活的代理应先读这份技能，再读 `DESIGN.md` 和 `tokens.css`，然后才写界面。如果代理没有自动读到，在任务里写明：先读 `.cursor/skills/zhejiao-ui/SKILL.md`。

## 决策记录

构建时的取舍、放过的做法、以及要你拍板的项，写在 [DECISIONS.md](DECISIONS.md)。
